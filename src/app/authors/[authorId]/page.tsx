"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookCard from "@/components/book-card";


export default function AuthorBooksPage() {
    const { authorId } = useParams();
    const [books, setBooks] = useState<any[]>([]);
    const [authorName, setAuthorName] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`/api/authors/${authorId}/books?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.books || []);
                setAuthorName(data.authorName || "");
                setTotalPages(data.pagination?.totalPages || 1);
            });
    }, [authorId, page]);

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="mb-6 text-3xl font-bold">
                {authorName || "Author"}
            </h1>

            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                book={{
                                    ...book,
                                    img: book.coverImage,   // 🔥 FIX
                                    desc: book.description || "", // safety
                                }}
                            />

                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-14 flex items-center justify-center gap-6">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded border px-4 py-2 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="rounded border px-4 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
