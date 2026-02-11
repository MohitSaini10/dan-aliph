"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

type BookStatus = "pending" | "approved" | "rejected";

type BookType = {
  _id: string;
  title: string;
  category?: string;
  coverImage?: string;
  status?: BookStatus;
  price?: number;
  createdAt?: string;
};

export default function AuthorBooksPage() {
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const [books, setBooks] = React.useState<BookType[]>([]);

  // ✅ filters
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | BookStatus
  >("all");
  const [search, setSearch] = React.useState("");

  async function loadBooks() {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("/api/author/books", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load books");
        setBooks([]);
        return;
      }

      setBooks(data?.books || []);
    } catch (err) {
      setMsg("Something went wrong while loading books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadBooks();
  }, []);

  // ✅ badge class
  const badgeClass = (status?: string) => {
    if (status === "approved") return "bg-green-50 text-green-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  // ✅ counts
  const totalCount = books.length;
  const pendingCount = books.filter((b) => b.status === "pending").length;
  const approvedCount = books.filter((b) => b.status === "approved").length;
  const rejectedCount = books.filter((b) => b.status === "rejected").length;

  // ✅ filtered list
  const filteredBooks = books
    .filter((b) => {
      if (statusFilter === "all") return true;
      return b.status === statusFilter;
    })
    .filter((b) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (b.title || "").toLowerCase().includes(q) ||
        (b.category || "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your published and pending books.
          </p>
        </div>

        <Link
          href="/author/dashboard/books/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add New Book
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-4">
        {/* search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
        />

        {/* tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              statusFilter === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white border-yellow-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setStatusFilter("approved")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              statusFilter === "approved"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            onClick={() => setStatusFilter("rejected")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              statusFilter === "rejected"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {msg}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">No books found</h2>
          <p className="mt-2 text-sm text-gray-600">
            Try changing filter or search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="relative h-44 w-full bg-gray-100">
                <Image
                  src={book.coverImage || "/placeholder-book.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                      {book.category || "Category"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                      book.status
                    )}`}
                  >
                    {book.status || "pending"}
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {book.price && book.price > 0 ? `₹${book.price}` : "Free"}
                </p>

               
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
