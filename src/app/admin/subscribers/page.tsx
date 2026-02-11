"use client";

import { useEffect, useState } from "react";

type SubscriberType = {
  _id: string;
  email: string;
  isActive: boolean;
  source: string;
  createdAt: string;
};

export default function AdminSubscribersPage() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  async function loadSubscribers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/subscribers", {
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || "Failed to load subscribers");
        return;
      }

      setSubscribers(data.subscribers || []);
    } catch {
      setMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <p className="text-sm text-gray-600">
          Total subscribers: {subscribers.length}
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by email..."
        className="w-full rounded-xl border px-4 py-2 text-sm"
      />

      {msg && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-6">
          Loading subscribers...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">
                    {s.isActive ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{s.source}</td>
                  <td className="px-4 py-3">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No subscribers found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
