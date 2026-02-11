"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  UsersIcon,
  BookOpenIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<any>({
    totalUsers: 0,
    totalAuthors: 0,
    totalBooks: 0,
    recentUsers: [],
  });

  const [loading, setLoading] = React.useState(true);

  async function loadStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();

      setStats({
        totalUsers: data.totalUsers || 0,
        totalAuthors: data.totalAuthors || 0,
        totalBooks: data.totalBooks || 0,
        recentUsers: data.recentUsers || [],
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadStats();
  }, []);

  const chartData = [
    { name: "Users", total: stats.totalUsers },
    { name: "Authors", total: stats.totalAuthors },
    { name: "Books", total: stats.totalBooks },
  ];

  return (
    <section className="space-y-6">
      

      {/* ✅ Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Users */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">Total Users</p>
            <UsersIcon className="h-6 w-6 text-gray-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {loading ? "..." : stats.totalUsers}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            All registered users in system
          </p>
        </div>

        {/* Authors */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">Total Authors</p>
            <PencilSquareIcon className="h-6 w-6 text-gray-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {loading ? "..." : stats.totalAuthors}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Authors who can publish books
          </p>
        </div>

        {/* Books */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">Total Books</p>
            <BookOpenIcon className="h-6 w-6 text-gray-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {loading ? "..." : stats.totalBooks}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Books currently available
          </p>
        </div>
      </div>

      {/* ✅ Chart + Recent users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Overview Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Quick comparison between users, authors and books.
          </p>

          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm font-semibold text-gray-700 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : stats.recentUsers?.length ? (
              stats.recentUsers.map((u: any) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {u.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No recent users found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
