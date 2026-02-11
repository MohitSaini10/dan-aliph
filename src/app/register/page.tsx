"use client";

import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ✅ Client validation
  function validateForm() {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;

    if (name.length < 2) return "Name must be at least 2 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    // ✅ phone required & exactly 10 digits
    if (!/^\d{10}$/.test(phone)) return "Phone must be exactly 10 digits.";

    if (password.length < 6) return "Password must be at least 6 characters.";

    return "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const error = validateForm();
    if (error) {
      setMsg(error);
      return;
    }

    setLoading(true);

    // ✅ normalize input
    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password.trim(),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ Already registered
      if (res.status === 409) {
        setMsg("This email is already registered. Please login.");
        setTimeout(() => router.push("/login"), 1200);
        return;
      }

      if (!res.ok) {
        setMsg(data?.message || "Register failed");
        return;
      }

      router.push("/login");
    } catch (err) {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="container mx-auto max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        <Typography variant="h4" color="blue-gray">
          Create Account
        </Typography>

        {msg && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* @ts-ignore */}
          <Input
            label="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* @ts-ignore */}
          <Input
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value.toLowerCase().trim(),
              })
            }
          />

          {/* ✅ Phone required + 10 digits only */}
          {/* @ts-ignore */}
          <Input
            label="Phone (10 digits)"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10),
              })
            }
          />

          {/* Password with eye icon */}
          {/* @ts-ignore */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="mr-2 grid place-items-center"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            }
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          If you already have an account
          <Link href="/login" className="ml-2 font-semibold text-gray-900">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
