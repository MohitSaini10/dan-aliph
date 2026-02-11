"use client";

import React from "react";
import Link from "next/link";
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8">
        {/* ✅ MOBILE OVERLAY */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          />
        )}

        {/* ✅ SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-5 shadow-sm transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:rounded-2xl md:border md:shadow-sm`}
        >
          {/* ❌ Close button (mobile) */}
          <button
            title="cb"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Logo / Title */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Dan Aliph</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              <HomeIcon className="h-5 w-5" />
              Home
            </Link>

            <Link
              href="/admin"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/users"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Users
            </Link>

            <Link
              href="/admin/subscribers"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Subscribers
            </Link>

            <Link
              href="/admin/publish-requests"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Publish Requests
            </Link>

            <Link href="/admin/contact-us" 
            className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100">
              Contact Messages
            </Link> 


            <Link
              href="/admin/authors"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Approve Authors
            </Link>

            <Link
              href="/admin/books"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Approve Books
            </Link>

            <Link
              href="/admin/books/manage"
              className="block rounded-xl px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Manage Books
            </Link>

            {/* Logout */}
            <div className="pt-4">
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 px-4 py-2 text-left text-sm font-semibold text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </aside>

        {/* ✅ MAIN CONTENT */}
        <main className="flex-1">
          {/* ✅ TOP BAR */}
          <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              {/* 📱 Hamburger (mobile only) */}
              <button
                title="hb"
                onClick={() => setOpen(true)}
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">
                  Manage users, authors, books and requests.
                </p>
              </div>
            </div>
          </div>

          {/* Page content */}
          {children}
        </main>
      </div>
    </div>
  );
}
