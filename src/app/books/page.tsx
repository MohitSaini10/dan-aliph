"use client";

import React from "react";

import { Typography, Button } from "@material-tailwind/react";
import BookCard from "@/components/book-card";

export default function BooksPage() {
  const [books, setBooks] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  // 🔍 SEARCH
  const [search, setSearch] = React.useState("");

  async function loadBooks(currentPage = 1, q = "") {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/books?page=${currentPage}&q=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      setBooks(data.books || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔁 Reload on page OR search change
  React.useEffect(() => {
    loadBooks(page, search);
  }, [page, search]);

  return (
    <section className="px-8 py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <Typography variant="h2" color="blue-gray">
            All Featured Books
          </Typography>

          <Typography
            variant="lead"
            className="mx-auto mt-2 w-full !text-gray-500 lg:w-7/12"
          >
            Browse all available books by title, category, author.
          </Typography>
        </div>

        {/* 🔍 Search */}
        
        <div className="mb-12 max-w-xl mx-auto">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page on new search
            }}
            placeholder="Search by title, category, author..."
            className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2  "

          />
        </div>

        {/* Books */}
        {loading ? (
          <div className="text-center text-sm text-gray-600">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="text-center text-sm text-gray-600">
            No books found{search ? ` for "${search}"` : ""}.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                _id={book._id}
                img={book.coverImage || "/placeholder-book.jpg"}
                title={book.title}
                desc={book.description || "No description available."}
                category={book.category || "Book"}
                authorName={book.authorName} 
                price={Number(book.price || 0)}
                pdfUrl={book.pdfUrl}
                buyLinks={book.buyLinks}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading &&  (
          <div className="mt-14 flex items-center justify-center gap-6">
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
