"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  PlusCircleIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

type StatsType = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type RecentBook = {
  _id: string;
  title: string;
  category?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function AuthorDashboardPage() {
  const [loading, setLoading] = React.useState(true);

  const [stats, setStats] = React.useState<StatsType>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [recent, setRecent] = React.useState<RecentBook[]>([]);

  async function loadStats() {
    try {
      setLoading(true);

      const res = await fetch("/api/author/stats", { cache: "no-store" });
      const data = await res.json();

      if (res.ok) {
        setStats({
          total: data?.total || 0,
          pending: data?.pending || 0,
          approved: data?.approved || 0,
          rejected: data?.rejected || 0,
        });

        setRecent(data?.recent || []);
      }
    } catch (err) {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadStats();
  }, []);

  const statusBadge = (status?: string) => {
    if (status === "approved") return "bg-green-50 text-green-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your profile and books from here.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/author/dashboard/books/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add New Book
          </Link>

          <Link
            href="/author/dashboard/books"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <BookOpenIcon className="h-5 w-5" />
            My Books
          </Link>

          <Link
            href="/author/profile"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <UserCircleIcon className="h-5 w-5" />
            My Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="h-7 w-7 text-gray-800" />
            <div>
              <p className="text-sm font-medium text-gray-500">My Books</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-7 w-7 text-gray-800" />
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-7 w-7 text-gray-800" />
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-7 w-7 text-gray-800" />
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <p className="mt-1 text-sm text-gray-600">
          Your latest book submissions.
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
              Loading recent activity...
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
              No recent activity found.
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-600">
                      {b.category || "Category"} •{" "}
                      {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      b.status
                    )}`}
                  >
                    {b.status || "pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
