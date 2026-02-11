"use client";

import React from "react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [replyText, setReplyText] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/contact-us", { cache: "no-store" });
    const data = await res.json();
    setContacts(data.contacts || []);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function sendReply(id: string) {
    await fetch("/api/admin/contact-us", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply: replyText }),
    });

    setReplyText("");
    setActiveId(null);
    load();
  }

  async function remove(id: string) {
    await fetch("/api/admin/contact-us", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact Messages</h1>

      {contacts.map((c) => (
        <div key={c._id} className="rounded border bg-white p-4 space-y-3">
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm">{c.email}</p>
            <p className="text-sm">{c.phone}</p>
            <p className="text-sm text-gray-600">{c.message}</p>
            <p className="text-xs text-gray-400">
              Status: {c.status}
            </p>
          </div>

          {activeId === c._id ? (
            <div className="space-y-2">
              <textarea
                className="w-full rounded border p-2"
                placeholder="Write reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />

              <button
                onClick={() => sendReply(c._id)}
                className="rounded bg-green-600 px-3 py-1 text-white text-sm"
              >
                Send Reply
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveId(c._id)}
                className="rounded bg-blue-600 px-3 py-1 text-white text-sm"
              >
                Reply
              </button>

              <button
                onClick={() => remove(c._id)}
                className="rounded bg-red-600 px-3 py-1 text-white text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
