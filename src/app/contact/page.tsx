"use client";

import React from "react";
import {
  Typography,
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
} from "@material-tailwind/react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to send message");
        return;
      }

      setMsg("✅ Thank you! We will contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setMsg("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Contact Us
          </Typography>

          <Typography className="mx-auto w-full !text-gray-500 lg:w-8/12">
            Have any questions or need help? Send us a message.
          </Typography>
        </div>

        <Card className="rounded-2xl border shadow-sm">
          <CardBody>
            {msg && (
              <p
                className={`mb-4 text-sm ${
                  msg.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {msg}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input label="Your Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              <Textarea label="Your Message" name="message" value={formData.message} onChange={handleChange} required />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
