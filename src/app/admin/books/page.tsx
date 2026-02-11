"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

type BookType = {
  _id: string;
  title: string;
  category?: string;
  authorName?: string;
  authorEmail?: string;
  status?: "pending" | "approved" | "rejected";
  coverImage?: string;
  createdAt?: string;
};

export default function AdminBooksPage() {
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const [books, setBooks] = React.useState<BookType[]>([]);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  async function loadBooks() {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("/api/admin/books", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load pending books");
        setBooks([]);
        return;
      }

      setBooks(data?.books || []);
    } catch (err) {
      setMsg("Something went wrong while loading pending books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadBooks();
  }, []);

  async function approveBook(bookId: string) {
    try {
      setActionLoading(bookId);
      setMsg("");

      const res = await fetch("/api/admin/books/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Approve failed");
        return;
      }

      await loadBooks();
    } catch (err) {
      setMsg("Something went wrong while approving.");
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectBook(bookId: string) {
    try {
      setActionLoading(bookId);
      setMsg("");

      const reason = window.prompt("Reject reason? (optional)") || "";

      const res = await fetch("/api/admin/books/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, reason }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Reject failed");
        return;
      }

      await loadBooks();
    } catch (err) {
      setMsg("Something went wrong while rejecting.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            Approve or reject new book submissions.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <BookOpenIcon className="h-5 w-5" />
          Admin Home
        </Link>
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
          <p className="text-sm font-semibold text-gray-700">
            Loading pending books...
          </p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            No pending books ✅
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            All book submissions are cleared.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              {/* Cover */}
              <div className="relative h-44 w-full bg-gray-100">
                <Image
                  src={book.coverImage || "/placeholder-book.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    {book.category || "Category"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 text-sm">
                  <p className="font-semibold text-gray-800">
                    Author: {book.authorName || "Unknown"}
                  </p>
                  <p className="text-gray-600">
                    {book.authorEmail || "No email"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={actionLoading === book._id}
                    onClick={() => approveBook(book._id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    {actionLoading === book._id ? "..." : "Approve"}
                  </button>

                  <button
                    disabled={actionLoading === book._id}
                    onClick={() => rejectBook(book._id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    {actionLoading === book._id ? "..." : "Reject"}
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
