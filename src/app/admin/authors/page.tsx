"use client";

import React from "react";

export default function AdminAuthorsPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [error, setError] = React.useState("");
  const [actionLoadingId, setActionLoadingId] = React.useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/authors", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to load author requests");
        return;
      }

      setRequests(data.requests || []);
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadRequests();
  }, []);

  async function approve(userId: string) {
    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/authors/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to approve");
        return;
      }

      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } finally {
      setActionLoadingId("");
    }
  }

  async function reject(userId: string) {
    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/authors/reject", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to reject");
        return;
      }

      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } finally {
      setActionLoadingId("");
    }
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-5 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Author Requests</h2>
          <p className="text-sm text-gray-600">
            Approve or reject author dashboard access.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-gray-600">Loading requests...</p>}

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Requested</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-4 font-semibold text-gray-900">{u.name}</td>
                  <td className="text-gray-700">{u.email}</td>
                  <td className="text-gray-700">{u.phone || "-"}</td>
                  <td className="text-gray-600 text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        disabled={actionLoadingId === u._id}
                        onClick={() => approve(u._id)}
                        className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        disabled={actionLoadingId === u._id}
                        onClick={() => reject(u._id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <p className="mt-4 text-sm text-gray-600">
              No author requests found.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
