"use client";
import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const FAQS = [
  {
    title: "How can I publish my book with Dan Aliph?",
    desc: "Simply go to our Services page and submit your details. Our team will contact you and guide you step-by-step through the publishing process.",
  },
  {
    title: "What services do you provide for book publishing?",
    desc: "We provide complete publishing support including editing, proofreading, cover design, formatting, printing, ISBN support and distribution options.",
  },
  {
    title: "How much time does it take to publish a book?",
    desc: "Publishing timelines depend on your book length and required services. In most cases, the process takes around 2 to 6 weeks from approval to final publishing.",
  },
  {
    title: "Do you provide ISBN and copyright support?",
    desc: "Yes, we help authors with ISBN guidance and basic copyright support so your book is professionally published and ready for distribution.",
  },
  {
    title: "Can I publish in paperback or hardcover format?",
    desc: "Yes, you can publish your book in multiple formats such as paperback, hardcover, and even eBook, depending on your requirements.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
<section className="px-8 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4">
            Frequently Asked Questions
          </Typography>

          {/* ✅ Updated Paragraph (Option 1) */}
          <Typography
            variant="lead"
            className="mx-auto mb-24 w-full max-w-2xl !text-gray-500"
          >
            Find answers about our book publishing process, pricing, timelines,
            and services like editing, cover design, printing & distribution.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader className="text-left text-gray-900">
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography color="blue-gray" className="font-normal text-gray-500">
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
