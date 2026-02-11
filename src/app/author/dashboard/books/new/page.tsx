"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import R2Upload from "@/components/author/R2Upload";

export default function NewBookPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Book fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");

  // ✅ Author suggested price
  const [price, setPrice] = useState("");

  // ✅ R2 uploaded URLs
  const [coverImage, setCoverImage] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // ✅ Optional Buy Links
  const [amazonLink, setAmazonLink] = useState("");
  const [flipkartLink, setFlipkartLink] = useState("");


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!title || !category || !coverImage || !pdfUrl) {
      setMsg("Title, Category, Cover image and PDF are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/author/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          language,
          description,
          coverImage, // ✅ R2 URL
          pdfUrl,     // ✅ R2 URL
          price: price ? Number(price) : 0, // ✅ Author suggested price
          buyLinks: {
          amazon: amazonLink.trim(),
          flipkart: flipkartLink.trim(),},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Failed to submit book");
        return;
      }

      // Success
      router.push("/author/dashboard/books");
      router.refresh();
    } catch {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Book
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload book files and submit for admin approval.
          </p>
        </div>

        <Link
          href="/author/dashboard/books"
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </div>

      {/* Message */}
      {msg && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {msg}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {/* Book Title */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Book Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Eg: Class 8 Maths"
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        {/* Price (Suggested by Author) */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Price (₹)
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Eg: 199 (leave 0 for free)"
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is a suggested price. Admin can change it later.
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Language
          </label>
          <select
          title="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Urdu</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Write book details..."
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        {/* Buy Links (Optional) */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Amazon */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Amazon Buy Link (optional)
            </label>
            <input
              type="url"
              value={amazonLink}
              onChange={(e) => setAmazonLink(e.target.value)}
              placeholder="https://www.amazon.in/..."
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
            />
          </div>

          {/* Flipkart */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Flipkart Buy Link (optional)
            </label>
            <input
              type="url"
              value={flipkartLink}
              onChange={(e) => setFlipkartLink(e.target.value)}
              placeholder="https://www.flipkart.com/..."
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
            />
          </div>
        </div>


        {/* Uploads */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 🖼 Cover Image Upload */}
          <R2Upload
            label="Upload Cover Image"
            accept="image/*"
            onUploaded={(url) => setCoverImage(url)}
          />

          {/* 📘 PDF Upload */}
          <R2Upload
            label="Upload Book PDF"
            accept=".pdf"
            onUploaded={(url) => setPdfUrl(url)}
          />
        </div>

        {/* Preview */}
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover Preview"
            className="h-40 rounded-xl border"
          />
        )}



        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          <PlusCircleIcon className="h-5 w-5" />
          {loading ? "Submitting..." : "Submit Book"}
        </button>
      </form>
    </div>
  );
}
