"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  HomeIcon,
  RectangleStackIcon,
  UserCircleIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function AuthorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  const linkClass = (href: string) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition ${
      pathname === href
        ? "bg-gray-900 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 rounded-2xl border bg-white p-5 shadow-sm md:block">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Dan Aliph</h2>
            <p className="text-sm text-gray-500">Author Panel</p>
          </div>

          <nav className="space-y-2">
            {/* ✅ Home */}
            <Link href="/" className={linkClass("/")}>
              <HomeIcon className="h-5 w-5" />
              Home
            </Link>

            {/* ✅ Dashboard */}
            <Link
              href="/author/dashboard"
              className={linkClass("/author/dashboard")}
            >
              <RectangleStackIcon className="h-5 w-5" />
              Dashboard
            </Link>

            {/* ✅ Profile */}
            <Link
              href="/account"
              className={linkClass("/account")}
            >
              <UserCircleIcon className="h-5 w-5" />
              My Profile
            </Link>

            {/* ✅ Books */}
            <Link
              href="/author/dashboard/books"
              className={linkClass("/author/dashboard/books")}
            >
              <BookOpenIcon className="h-5 w-5" />
              My Books
            </Link>

            {/* ✅ Logout */}
            <button
              onClick={logout}
              className="mt-6 flex w-full items-center gap-2 rounded-xl px-4 py-2 font-medium text-red-600 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
