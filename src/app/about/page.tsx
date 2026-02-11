"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

export default function AboutPage() {
  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            About Us
          </Typography>

          <Typography
            variant="lead"
            className="mx-auto w-full px-4 !text-gray-500 lg:w-8/12"
          >
            Welcome to <span className="font-semibold">Dan Aliph</span> — your
            trusted platform for books, learning, and publishing.
          </Typography>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-3">
              Who We Are
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              Dan Aliph is a learning-focused bookstore and publishing support
              platform. We aim to help students, teachers, and book lovers find
              the best resources easily.
              <br />
              <br />
              We also support new and experienced writers in publishing their
              books professionally.
            </Typography>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-3">
              What We Provide
            </Typography>
            <ul className="space-y-3 text-gray-700">
              <li>✅ School books & educational resources</li>
              <li>✅ Competitive exam preparation books</li>
              <li>✅ Story books & motivational reading</li>
              <li>✅ Writer services: publish your book easily</li>
              <li>✅ Quick customer support & guidance</li>
            </ul>
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-3">
              Our Mission
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              Our mission is to make quality books and learning resources
              accessible for everyone and to create a supportive space for
              writers to publish and grow.
            </Typography>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-3">
              Our Vision
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              We want to build a modern digital library and publishing ecosystem
              where every learner and writer gets the right support at the right
              time.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
