"use client";

import React from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@material-tailwind/react";

/* ======================
   📘 Book Type
====================== */
interface Book {
  _id: string;
  img: string;
  title: string;
  desc: string;
  category: string;
  authorName?: string;
  price: number;
  offPrice?: number;
  pdfUrl?: string;
  buyLinks?: {
    amazon?: string;
    flipkart?: string;
  };
}

/* ======================
   🧩 Props (Backward Compatible)
====================== */
interface BookCardProps {
  // ✅ NEW (preferred)
  book?: Book;

  // ✅ OLD (existing usage)
  _id?: string;
  img?: string;
  title?: string;
  desc?: string;
  category?: string;
  authorName?: string;
  price?: number;
  offPrice?: number;
  pdfUrl?: string;
  buyLinks?: {
    amazon?: string;
    flipkart?: string;
  };
}

export function BookCard(props: BookCardProps) {
  /* ======================
     🔄 Normalize Props
  ====================== */
  const book: Book = props.book ?? {
    _id: props._id!,
    img: props.img!,
    title: props.title!,
    desc: props.desc!,
    category: props.category!,
    authorName: props.authorName,
    price: props.price!,
    offPrice: props.offPrice,
    pdfUrl: props.pdfUrl,
    buyLinks: props.buyLinks,
  };

  const {
    img,
    category,
    authorName,
    title,
    desc,
    price,
    offPrice,
    pdfUrl,
    buyLinks,
  } = book;

  const isPaid = price > 0;

  /* ======================
     🎨 UI
  ====================== */
  return (
    <Card color="transparent" shadow={false}>
      <CardHeader
        color="gray"
        floated={false}
        className="relative mx-0 mt-0 mb-6 h-64 overflow-hidden"
      >
        {/* 👤 Author Badge */}
        {authorName && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white backdrop-blur shadow-md">
            👤 {authorName}
          </div>
        )}

        {/* 📘 Cover */}
        {price === 0 && pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="relative block h-full w-full"
          >
            <Image
              src={img}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </a>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={img}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
      </CardHeader>

      <CardBody className="px-0 pt-2 pb-3">
        <Typography color="blue" className="mb-2 text-xs !font-semibold">
          {category}
        </Typography>

        {/* 📖 Title */}
        {!isPaid && pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noreferrer">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-1 font-bold normal-case xl:w-64"
            >
              {title}
            </Typography>
          </a>
        ) : (
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-1 font-bold leading-snug"
          >
            {title}
            {isPaid && (
              <span className="ml-2 text-sm text-red-500">🔒 Paid</span>
            )}
          </Typography>
        )}

        <Typography className="mb-2 text-sm leading-snug !text-gray-500 line-clamp-2">
          {desc}
        </Typography>

        {/* 💰 Price */}
        <div className="mb-1 flex items-center gap-2">
          <Typography
            variant="h5"
            color="blue-gray"
            className={offPrice ? "line-through" : ""}
          >
            ₹{price}
          </Typography>

          {offPrice && (
            <Typography variant="h5" color="red">
              ₹{offPrice}
            </Typography>
          )}

          {price === 0 && (
            <span className="text-sm font-semibold text-green-600">FREE</span>
          )}
        </div>

        {/* 🔘 Actions */}
        <div className="relative z-10 mt-2 flex flex-wrap items-center gap-5">
          {/* READ */}
          {!isPaid && pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              <Button size="sm" color="blue">
                Read
              </Button>
            </a>
          )}

          {/* BUY LINKS */}
          <div className="flex items-center gap-3">
            {buyLinks?.amazon?.trim() && (
              <a
                href={buyLinks.amazon}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center justify-center rounded-md border border-gray-400 px-4 transition hover:border-gray-600 hover:bg-gray-50"
              >
                <Image
                  src="/brands/amazon.png"
                  alt="Amazon"
                  width={70}
                  height={22}
                  className="object-contain"
                />
              </a>
            )}

            {buyLinks?.flipkart?.trim() && (
              <a
                href={buyLinks.flipkart}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center justify-center rounded-md border border-gray-400 px-4 transition hover:border-gray-600 hover:bg-gray-50"
              >
                <Image
                  src="/brands/flipkart.png"
                  alt="Flipkart"
                  width={70}
                  height={22}
                  className="object-contain"
                />
              </a>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default BookCard;
