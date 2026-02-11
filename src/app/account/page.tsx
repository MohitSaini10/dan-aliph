"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [msg, setMsg] = React.useState("");
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [imgLoading, setImgLoading] = React.useState(false);

  /* =========================
     🔄 Load Current User
  ========================= */
  async function loadMe() {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();

      if (!data?.isLoggedIn) {
        router.replace("/login");
        return;
      }

      setUser(data);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadMe();
  }, []);

  /* =========================
     👤 Request Author Role
  ========================= */
  async function requestAuthor() {
    try {
      setBtnLoading(true);
      setMsg("");

      const res = await fetch("/api/author/request", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to request author access");
        return;
      }

      setMsg("✅ Author request sent! Admin will review it soon.");
      await loadMe();
    } catch {
      setMsg("Something went wrong!");
    } finally {
      setBtnLoading(false);
    }
  }

  /* =========================
     📸 Upload Profile Image
     (Cloudflare Images – FINAL)
  ========================= */
  async function uploadProfileImage(file: File) {
    try {
      setImgLoading(true);

      // 1️⃣ Get R2 upload URL
      const urlRes = await fetch(
        "/api/author/profile-image/upload-url",
        { credentials: "include" }
      );

      if (!urlRes.ok) {
        alert("Failed to get upload URL");
        return;
      }

      const { uploadURL, publicUrl } = await urlRes.json();
      if (!uploadURL || !publicUrl) {
        alert("Upload URL missing");
        return;
      }

      // 2️⃣ Upload directly to R2
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) {
        alert("R2 upload failed");
        return;
      }

      // 3️⃣ Save public URL in DB
      const saveRes = await fetch("/api/author/profile-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!saveRes.ok) {
        alert("Failed to save profile image");
        return;
      }

      await loadMe();
    } catch (err) {
      console.error("UPLOAD ERROR =>", err);
      alert("Something went wrong");
    } finally {
      setImgLoading(false);
    }
  }


  /* =========================
     ⏳ Loading UI
  ========================= */
  if (loading) {
    return (
      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Loading account...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile and author access.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-700">
                {user?.name?.[0]}
              </div>
            )}

            {user?.role === "author" && (
              <label className="cursor-pointer text-sm font-semibold text-blue-600">
                {imgLoading ? "Uploading..." : "Change Photo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadProfileImage(file);
                    e.target.value = "";
                  }}
                />

              </label>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-900">{user?.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <span className="inline-flex w-fit rounded-xl bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Author Access */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Author Access
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            If you want to publish books, request author access.
          </p>

          {msg && (
            <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
              {msg}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={requestAuthor}
              disabled={btnLoading || user?.role === "author"}
              className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {btnLoading
                ? "Sending..."
                : user?.role === "author"
                  ? "You are already an Author"
                  : "Become an Author"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
