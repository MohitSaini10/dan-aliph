"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

export default function PoliciesPage() {
  return (
    <section className="px-8 py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Policies
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto w-full px-4 !text-gray-500 lg:w-9/12"
          >
            Please read our policies carefully. These policies help us provide a
            safe and smooth experience for all users.
          </Typography>
        </div>

        {/* Policy Cards */}
        <div className="space-y-8">
          {/* Privacy Policy */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Privacy Policy
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              We respect your privacy. Any information you provide on our
              website, including your name, email, and phone number, is used
              only to provide services like order updates, publishing support,
              and customer help. We do not sell or share your personal data with
              third parties without your permission.
            </Typography>
          </div>

          {/* Terms & Conditions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Terms & Conditions
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              By using Dan Aliph, you agree to follow all website rules and
              policies. All content, categories, and materials available on this
              website are for informational and service purposes. Any misuse of
              the platform is strictly prohibited.
            </Typography>
          </div>

          {/* Refund Policy */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Refund Policy
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              Refunds are applicable only when the product is damaged, incorrect
              or not delivered. Customers must request a refund within 24-48
              hours of delivery with proper proof (image/video). Refund will be
              processed after verification.
            </Typography>
          </div>

          {/* Shipping / Delivery */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Shipping & Delivery Policy
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              We offer fast and reliable shipping. Delivery time depends on your
              location and book availability. If any delay happens, we will
              inform you through email/phone.
            </Typography>
          </div>

          {/* Publishing Policy */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Publishing Policy
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              If you submit your book publishing request, our team will review
              the details and contact you within 24-72 hours. Publishing charges
              and timelines depend on book format, size, and services required.
            </Typography>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Contact
            </Typography>
            <Typography className="!text-gray-600 leading-relaxed">
              For any questions regarding policies, you can contact us:
              <br />
              <span className="font-medium">Email:</span> uts.danaliph@gmail.com
              <br />
              <span className="font-medium">Phone:</span> +91-000000000
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
