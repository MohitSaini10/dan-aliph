"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Typography, Button, Input } from "@material-tailwind/react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubscribe() {
    setMsg("");

    if (!email) {
      setMsg("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Subscription failed");
        return;
      }

      setMsg(data.message || "Subscribed successfully 🎉");
      setEmail("");
    } catch {
      setMsg("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-black px-6 pt-16 text-white">
      <div className="container mx-auto">
        {/* TOP */}
        <div className="grid gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-10">
            {/* Logo + Description */}
            <div>
              <h3 className="text-2xl font-bold tracking-wide">
                Dan Aliph
              </h3>
              <p className="mt-3 max-w-md text-sm text-gray-400">
                Dan Aliph is a modern publishing platform helping authors
                bring their stories to life through quality publishing,
                marketing, and global reach.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="mb-3 text-sm font-semibold">
                Join our newsletter to get updates about new releases and offers.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Email input */}
                <Input
                  label="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  labelProps={{ className: "!text-gray-400" }}
                  className="!text-white"
                  containerProps={{ className: "min-w-0" }}
                />

                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="bg-white text-black hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>

              {/* Message */}
              {msg && (
                <p className="mt-2 text-sm text-gray-300">
                  {msg}
                </p>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <a className="rounded-xl border border-white/20 p-3 hover:border-white">
                <InstagramIcon size={18} />
              </a>
              <a className="rounded-xl border border-white/20 p-3 hover:border-white">
                <FacebookIcon size={18} />
              </a>
              <a className="rounded-xl border border-white/20 p-3 hover:border-white">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-4 text-sm font-semibold">Quick Links</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/faq">FAQs</Link></li>
                <li><Link href="/services">Retail Network</Link></li>
                <li><Link href="/books">Bestsellers</Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold">Genres</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/books">Classics</Link></li>
                <li><Link href="/books">Sci-fi</Link></li>
                <li><Link href="/books">Romance</Link></li>
                
                <li><Link href="/books">Non-fiction</Link></li>
                <li><Link href="/books">Fiction</Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold">Languages</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/books">English Collection</Link></li>
                <li><Link href="/books">Hindi Collection</Link></li>
                <li><Link href="/books">Regional Languages</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500"> © {CURRENT_YEAR} Dan Aliph. All rights reserved. Made with{" "} <a href="https://unnattechnologyservices.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-300 hover:text-white" > UTS Moradabad (Mohit)</a> </p>

            <div className="flex gap-5 text-sm text-gray-500">
              <Link href="/">Terms</Link>
              <Link href="/policies">Usage Policy</Link>
              <Link href="/">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
