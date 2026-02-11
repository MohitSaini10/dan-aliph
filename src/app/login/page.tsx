"use client";

import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data.message || "Login failed");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <section className="px-6 py-16">
      <div className="container mx-auto max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        <Typography variant="h4" color="blue-gray">
          Login
        </Typography>

        {msg && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* @ts-ignore */}
          <Input
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}

          />

          {/* @ts-ignore */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          <Link href="/forgot-password" className="font-semibold text-gray-900">
            Forget password ?
          </Link>
        </p>
      </div>
    </section>
  );
}
