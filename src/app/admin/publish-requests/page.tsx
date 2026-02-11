"use client";

import React from "react";

export default function AdminPublishRequestsPage() {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/publish-requests", { cache: "no-store" });
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/publish-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/admin/publish-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Publish Requests</h1>

      {requests.map((r) => (
        <div
          key={r._id}
          className="rounded border bg-white p-2 flex justify-between"
        >
          <div>
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm">{r.email}</p>
            <p className="text-sm">{r.phone}</p>
            <p className="text-xs text-gray-500">Status: {r.status}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(r._id, "contacted")}
              className="rounded bg-blue-600 px-2 py-1 text-white text-sm"
            >
              Contacted
            </button>

            <button
              onClick={() => updateStatus(r._id, "converted")}
              className="rounded bg-green-600 px-2 py-1 text-white text-sm"
            >
              Converted
            </button>

            <button
              onClick={() => remove(r._id)}
              className="rounded bg-red-600 px-3 py-1 text-white text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
