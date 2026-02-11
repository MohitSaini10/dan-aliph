"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Typography, Button } from "@material-tailwind/react";

const BOOKS_DATA: Record<
  string,
  { id: number; name: string; author: string; price: string }[]
> = {
  "story-books": [
    { id: 1, name: "Panchatantra Stories", author: "Classic", price: "₹120" },
    { id: 2, name: "Akbar Birbal Stories", author: "Classic", price: "₹150" },
  ],
  "school-books": [
    { id: 1, name: "NCERT Class 8 Science", author: "NCERT", price: "₹180" },
    { id: 2, name: "NCERT Class 8 Maths", author: "NCERT", price: "₹170" },
  ],
  mathematics: [
    { id: 1, name: "RD Sharma (Class 10)", author: "RD Sharma", price: "₹550" },
    { id: 2, name: "RS Aggarwal (Class 9)", author: "RS Aggarwal", price: "₹420" },
  ],
  science: [
    { id: 1, name: "Science Experiments Book", author: "Guide", price: "₹250" },
    { id: 2, name: "NCERT Science Class 9", author: "NCERT", price: "₹200" },
  ],
};

export default function CategoryBooksPage() {
  const params = useParams();
  const category = params.category as string;

  const books = BOOKS_DATA[category] || [];

  // Category title formatting
  const categoryTitle = category
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <section className="px-8 py-10">
      <div className="container mx-auto mb-10">
        <Typography variant="h3" color="blue-gray" className="mb-3">
          {categoryTitle}
        </Typography>

        <Typography className="!text-gray-500 mb-6">
          Browse books available in this category.
        </Typography>

        <Link href="/books">
          <Button variant="outlined" size="sm">
            ← Back to Categories
          </Button>
        </Link>
      </div>

      <div className="container mx-auto">
        {books.length === 0 ? (
          <Typography className="!text-gray-500">
            No books found in this category.
          </Typography>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {book.name}
                </Typography>

                <Typography className="!text-gray-600">
                  Author: {book.author}
                </Typography>

                <Typography className="!text-gray-600 mb-4">
                  Price: {book.price}
                </Typography>

                <Button fullWidth>Buy Now</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
