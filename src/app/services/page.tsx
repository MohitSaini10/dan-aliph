"use client";

import React from "react";
import {
  Typography,
  Input,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react";

export default function ServicesPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const res = await fetch("/api/publish-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Submission failed");
        return;
      }

      setMsg("✅ Your request has been submitted successfully!");
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      setMsg("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-4xl">
        {/* Heading Section */}
        <div className="mb-10 text-center">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Ready to start <br /> your Journey?
          </Typography>

          <Typography className="mx-auto w-full !text-gray-500 lg:w-8/12">
            We help writers publish their book.
          </Typography>
        </div>

        {/* Form Card */}
        <Card className="rounded-2xl border border-gray-200 shadow-md">
          <CardBody>
            {/* Message */}
            {msg && (
              <Typography
                className={`mb-4 text-sm ${
                  msg.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {msg}
              </Typography>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                size="lg"
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                size="lg"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                size="lg"
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? "Submitting..." : "Publish My Book"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
