"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Author {
  authorId: string;
  name: string;
  totalBooks: number;
  profileImage?: string;
}

/* =========================
   👤 Author Avatar
========================= */
function AuthorAvatar({
  name,
  profileImage,
}: {
  name: string;
  profileImage?: string;
}) {
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        className="h-14 w-14 rounded-full object-cover"
      />
    );
  }

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-xl font-semibold text-white">
      {initial}
    </div>
  );
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/authors")
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data.authors || []); // 🔥 FIX
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-slate-600">Loading authors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        Authors
      </h1>

      {authors.length === 0 ? (
        <p className="text-slate-600">No authors found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.authorId}
              href={`/authors/${author.authorId}`}
              className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <AuthorAvatar
                  name={author.name}
                  profileImage={author.profileImage}
                />

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600">
                    {author.name}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {author.totalBooks} book
                    {author.totalBooks > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
