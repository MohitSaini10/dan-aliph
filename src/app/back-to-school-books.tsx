"use client";

import React from "react";
import Link from "next/link";
import { Button, Typography } from "@material-tailwind/react";
import BookCard from "@/components/book-card";

export function BackToSchoolBooks() {
  const [books, setBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Home page ke liye hamesha first page hi
  const page = 1;

  React.useEffect(() => {
    async function loadFeaturedBooks() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/book/featured?page=${page}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setBooks(data?.books || []);
      } catch (err) {
        console.error("FEATURED LOAD ERROR", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedBooks();
  }, []);

  return (
    <section className="px-8 pt-20 pb-10">
      {/* ---------- HEADER ---------- */}
      <div className="container mx-auto mb-20 text-center">
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-3 font-bold uppercase"
        >
          Featured Collection
        </Typography>

        <Typography variant="h1" color="blue-gray" className="mb-2">
          Featured / Trending Books
        </Typography>

        <Typography
          variant="lead"
          className="mx-auto w-full px-4 !text-gray-500 lg:w-9/12"
        >
          Discover our most popular and hand-picked books curated by our editors.
          Free books can be read instantly, paid books are available via trusted
          marketplaces.
        </Typography>
      </div>

      {/* ---------- BOOKS GRID ---------- */}
      <div className="container mx-auto grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Loading featured books...
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              No featured books available.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Admin can select featured books from dashboard.
            </p>
          </div>
        ) : (
          books.map((book: any) => (
            <BookCard
              key={book._id}
              _id={book._id}
              img={book.coverImage || "/placeholder-book.jpg"}
              category={book.category || "Book"}
              authorName={book.authorName}
              title={book.title}
              desc={book.description || "No description available."}
              price={Number(book.price || 0)}
              pdfUrl={book.pdfUrl}
              buyLinks={book.buyLinks}
            />
          ))
        )}
      </div>

      {/* ---------- CTA ---------- */}
      <div className="mt-24 grid place-items-center">
        <Link href="/books">
          <Button variant="outlined" className="px-8">
            View All Books
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default BackToSchoolBooks;
