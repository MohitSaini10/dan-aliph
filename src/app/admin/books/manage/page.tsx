"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpenIcon,
  StarIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

type BookType = {
  _id: string;
  title: string;
  category?: string;
  authorName?: string;
  authorEmail?: string;
  coverImage?: string;
  createdAt?: string;
  isFeatured?: boolean;
  featuredOrder?: number;
  price?: number;
};

export default function AdminManageBooksPage() {
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const [books, setBooks] = React.useState<BookType[]>([]);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // search
  const [search, setSearch] = React.useState("");

  // ✅ LOCAL DRAFT STATES
  const [draftPrices, setDraftPrices] = React.useState<Record<string, number>>(
    {}
  );
  const [draftOrders, setDraftOrders] = React.useState<Record<string, number>>(
    {}
  );

  // ---------------- LOAD BOOKS ----------------
  async function loadBooks() {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("/api/admin/books/approved", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load books");
        setBooks([]);
        return;
      }

      setBooks(data?.books || []);
    } catch {
      setMsg("Something went wrong while loading books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadBooks();
  }, []);

  // ---------------- SEARCH FILTER ----------------
  const filteredBooks = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;

    return books.filter((b) => {
      return (
        (b.title || "").toLowerCase().includes(q) ||
        (b.category || "").toLowerCase().includes(q) ||
        (b.authorName || "").toLowerCase().includes(q) ||
        (b.authorEmail || "").toLowerCase().includes(q)
      );
    });
  }, [books, search]);

  // ---------------- FEATURE TOGGLE ----------------
  async function toggleFeatured(book: BookType) {
    try {
      setActionLoading(book._id);
      setMsg("");

      const res = await fetch("/api/admin/books/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          isFeatured: !book.isFeatured,
          featuredOrder: book.featuredOrder || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Update failed");
        return;
      }

      await loadBooks();
    } catch {
      setMsg("Something went wrong while updating featured.");
    } finally {
      setActionLoading(null);
    }
  }

  // ---------------- SAVE PRICE + ORDER ----------------
  async function saveChanges(book: BookType) {
    try {
      setActionLoading(book._id);
      setMsg("");

      const price = draftPrices[book._id] ?? book.price ?? 0;
      const featuredOrder =
        draftOrders[book._id] ?? book.featuredOrder ?? 0;

      const res = await fetch(`/api/admin/books/${book._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price,
          featuredOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Save failed");
        return;
      }

      await loadBooks();
    } catch {
      setMsg("Something went wrong while saving changes.");
    } finally {
      setActionLoading(null);
    }
  }
  // ---------------- DELETE BOOK ----------------
  async function deleteBook(book: BookType) {
    const ok = confirm(
      "⚠️ This will permanently delete the book and its files.\nAre you sure?"
    );
    if (!ok) return;

    try {
      setActionLoading(book._id);
      setMsg("");

      const res = await fetch("/api/admin/books/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Delete failed");
        return;
      }

      // ✅ UI se turant remove
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch {
      setMsg("Something went wrong while deleting book.");
    } finally {
      setActionLoading(null);
    }
  }


  // ---------------- UI ----------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            Approved books with Featured & Price controls.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadBooks}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
          >
            <BookOpenIcon className="h-5 w-5" />
            Admin Home
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm"
          />
        </div>
      </div>

      {msg && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          Loading books...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              {/* Cover */}
              <div className="relative h-44 bg-gray-100">
                <Image
                  src={book.coverImage || "/placeholder-book.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
                {book.isFeatured && (
                  <div className="absolute right-3 top-3 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-900">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3 p-5">
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.category}</p>

                {/* Controls */}
                {/* Controls */}
<div className="flex flex-col gap-2">
  {/* Action Button */}
  <button
    onClick={() => toggleFeatured(book)}
    disabled={actionLoading === book._id}
    className="w-full rounded-xl bg-yellow-600 px-3 py-1 text-sm font-semibold text-white"
  >
    {book.isFeatured ? "Remove Featured" : "Make Featured"}
  </button>

  {/* Inputs Row */}
  <div className="flex items-end gap-3">
    {/* Price */}
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium text-gray-600">
        Price (₹)
      </label>
      <input
        type="number"
        min={0}
        value={draftPrices[book._id] ?? book.price ?? 0}
        onChange={(e) =>
          setDraftPrices({
            ...draftPrices,
            [book._id]: Number(e.target.value),
          })
        }
        className="w-24 rounded-xl border px-2 py-2 text-sm"
        placeholder="0 = Free"
      />
    </div>

    {/* Featured Order */}
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium text-gray-600">
        Featured Order
      </label>
      <input
        type="number"
        min={0}
        value={draftOrders[book._id] ?? book.featuredOrder ?? 0}
        disabled={!book.isFeatured}
        onChange={(e) =>
          setDraftOrders({
            ...draftOrders,
            [book._id]: Number(e.target.value),
          })
        }
        className="w-24 rounded-xl border px-2 py-2 text-sm disabled:bg-gray-100"
        placeholder="Order"
      />
    </div>
  </div>
</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => saveChanges(book)}
                    disabled={actionLoading === book._id}
                    className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    Save
                  </button>
                  {/* ✏️ Edit */}
                  <Link
                    href={`/admin/books/${book._id}/edit`}
                    className="flex-1 text-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBook(book)}
                    disabled={actionLoading === book._id}
                    className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {actionLoading === book._id ? "Deleting..." : "Delete"}
                  </button>
                </div>




              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
