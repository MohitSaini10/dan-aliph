"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/books/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm(d.book);
        setLoading(false);
      });
  }, [id]);

  async function save() {
    const res = await fetch(`/api/admin/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message || "Update failed");
      return;
    }

    router.push("/admin/books/manage");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Edit Book</h1>

     <p>Title <input
        title="title"
        value={form.title || ""}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full rounded border p-2"
      /></p>

     <p>Category <input
        title="category"
        value={form.category || ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full rounded border p-2"
      /></p>

      <p>Description<textarea
        title="eb"
        value={form.description || ""}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="w-full rounded border p-2"
      /></p>

      <p>Price<input
        title="price"
        type="number"
        value={form.price || 0}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
        className="w-full rounded border p-2"
      /></p>
      {/* Amazon Buy Link */}
      <p>Links
      <input
        type="url"
        placeholder="Amazon Buy Link (optional)"
        value={form.buyLinks?.amazon || ""}
        onChange={(e) =>
          setForm({
            ...form,
            buyLinks: {
              ...form.buyLinks,
              amazon: e.target.value,
            },
          })
        }
        className="w-full rounded border p-2"
      /></p>

      {/* Flipkart Buy Link */}
      <input
        type="url"
        placeholder="Flipkart Buy Link (optional)"
        value={form.buyLinks?.flipkart || ""}
        onChange={(e) =>
          setForm({
            ...form,
            buyLinks: {
              ...form.buyLinks,
              flipkart: e.target.value,
            },
          })
        }
        className="w-full rounded border p-2"
      />


      <button
        onClick={save}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Save Changes
      </button>

      {msg && <p className="text-red-600">{msg}</p>}
    </div>
  );
}
