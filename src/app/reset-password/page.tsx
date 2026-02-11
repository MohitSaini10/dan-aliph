"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, Typography } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!token) return setMsg("Reset token missing!");
    if (password.length < 6) return setMsg("Password must be at least 6 characters");
    if (password !== confirmPassword) return setMsg("Passwords do not match");

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data?.message || "Reset failed");
      return;
    }

    alert("✅ Password updated! Please login.");
    router.push("/login");
  }

  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Reset Password
          </Typography>
          <Typography className="!text-gray-500">
            Set a new password for your account.
          </Typography>
        </div>

        {msg && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          {/* @ts-ignore */}
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="mr-2 grid place-items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            }
          />

          {/* @ts-ignore */}
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </section>
  );
}
