"use client";

import React from "react";

export default function AdminUsersPage() {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<any[]>([]);
  const [error, setError] = React.useState("");
  const [actionLoadingId, setActionLoadingId] = React.useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to load users");
        return;
      }

      setUsers(data.users || []);
    } catch (e) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(userId: string, role: string) {
    try {
      setActionLoadingId(userId);

      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to update role");
        return;
      }

      await loadUsers();
    } finally {
      setActionLoadingId("");
    }
  }

 async function toggleBlock(userId: string, block: boolean) {
  try {
    setActionLoadingId(userId);

    const res = await fetch("/api/admin/users/block", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, block }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.message || "Failed to update status");
      return;
    }

    // ✅ UI instant update (no need to wait for loadUsers)
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isBlocked: block } : u))
    );

    // ✅ optional: reload from DB for safety (you can keep or remove)
    // await loadUsers();
  } finally {
    setActionLoadingId("");
  }
}


  async function editUser(userId: string, oldName: string, oldEmail: string) {
    const name = prompt("Enter new name:", oldName);
    if (!name) return;

    const email = prompt("Enter new email:", oldEmail);
    if (!email) return;

    try {
      setActionLoadingId(userId);

      const res = await fetch("/api/admin/users/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to update user");
        return;
      }

      await loadUsers();
    } finally {
      setActionLoadingId("");
    }
  }

  async function deleteUser(userId: string) {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      setActionLoadingId(userId);

      const res = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to delete user");
        return;
      }

      await loadUsers();
    } finally {
      setActionLoadingId("");
    }
  }

  return (
<section className="rounded-2xl border bg-white p-6 shadow-sm overflow-hidden">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          <p className="text-sm text-gray-600">
            Manage users & roles (User / Author ).
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-gray-600">Loading users...</p>}

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
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-4 font-semibold text-gray-900">{u.name}</td>

                  <td className="text-gray-700">{u.email}</td>

                  <td>
                    <select
                      title="ur"
                      value={u.role}
                      disabled={actionLoadingId === u._id}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                    >
                      <option value="user">user</option>
                      <option value="author">author</option>
                     
                    </select>
                  </td>

                  {/* ✅ Status */}
                  <td>
                    {u.isBlocked ? (
                      <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="text-gray-600 text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  {/* ✅ Actions */}
                  <td className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        disabled={actionLoadingId === u._id}
                        onClick={() => editUser(u._id, u.name, u.email)}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                      >
                        Edit
                      </button>

                      {u.isBlocked ? (
                        <button
                          disabled={actionLoadingId === u._id}
                          onClick={() => toggleBlock(u._id, false)}
                          className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          disabled={actionLoadingId === u._id}
                          onClick={() => toggleBlock(u._id, true)}
                          className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-100 disabled:opacity-50"
                        >
                          Block
                        </button>
                      )}

                      <button
                        disabled={actionLoadingId === u._id}
                        onClick={() => deleteUser(u._id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="mt-4 text-sm text-gray-600">No users found.</p>
          )}
        </div>
      )}
    </section>
  );
}
