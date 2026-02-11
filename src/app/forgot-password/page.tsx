"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  const data = await res.json();

  alert(data?.message || "Request submitted!");
  setEmail("");
};

  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Forgot Password
          </Typography>
          <Typography className="!text-gray-500">
            Enter your email to receive password reset instructions.
          </Typography>
        </div>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                size="lg"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" size="lg" fullWidth>
                Send Reset Link
              </Button>

              <Typography className="text-center text-sm !text-gray-500">
                Back to{" "}
                <Link href="/login" className="font-semibold text-gray-900">
                  Login
                </Link>
              </Typography>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
