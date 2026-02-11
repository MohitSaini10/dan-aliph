"use client";

export default function EducationPortalSection() {
  return (
    <section className="bg-gradient-to-r from-teal-50 to-sky-50 py-16 md:py-24
">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          Complimentary Education Portal
          <span className="block text-teal-600">
            for Connected Schools & Colleges
          </span>
        </h2>

        <p className="mt-4 text-slate-600 text-lg">
          Free digital learning support for partner institutions —
          resources, books, and academic tools at no extra cost.
        </p>

        <div className="mt-8">
          <a
            href="https://www.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4
                       bg-teal-600 text-white rounded-xl text-lg font-medium
                       shadow hover:bg-teal-700 transition"
          >
            Access Education Portal →
          </a>

          <p className="mt-3 text-sm text-slate-500">
            🔒 Available for partner schools & colleges only
          </p>
        </div>

      </div>
    </section>
  );
}
