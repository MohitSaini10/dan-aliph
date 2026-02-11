"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Typography } from "@material-tailwind/react";

function Hero() {
  const router = useRouter();

  const [auth, setAuth] = React.useState<{
    isLoggedIn: boolean;
    role?: string;
  }>({ isLoggedIn: false, role: "user" });

  React.useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data?.isLoggedIn) {
          setAuth({ isLoggedIn: false, role: "user" });
          return;
        }

        setAuth({
          isLoggedIn: true,
          role: data.role || "user",
        });
      } catch {
        setAuth({ isLoggedIn: false, role: "user" });
      }
    };

    check();
  }, []);

  const handlePublishClick = () => {
    // ❌ Not logged in
    if (!auth.isLoggedIn) return router.push("/register");

    // ✅ Role based redirect
    if (auth.role === "admin") return router.push("/admin");
    if (auth.role === "author") return router.push("/author/dashboard");

    return router.push("/account");
  };

  return (
    <header className="bg-white px-8 pt-8 lg:pt-12">
      <div className="container mx-auto grid h-full min-h-[90vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="row-start-2 lg:row-auto lg:-mt-40">
          <Typography
            variant="small"
            className="mb-3 inline-block rounded-full bg-gray-100 px-4 py-2 font-semibold tracking-wider text-gray-700"
          >
            PUBLISH YOUR BOOK
          </Typography>

          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-3 max-w-xl text-3xl !leading-snug lg:text-5xl"
          >
            Turn Your Story Into a Published Masterpiece
          </Typography>

          <Typography
            variant="lead"
            className="mb-6 font-normal !text-gray-500 md:pr-16 xl:pr-28"
          >
            We help writers publish their book with expert support — editing,
            cover design, ISBN, printing & distribution.
            <span className="block mt-2 font-medium text-gray-700">
              From first draft to final book — we’re with you at every step.
            </span>
          </Typography>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* ✅ Dynamic Button */}
            <Button
              size="lg"
              color="gray"
              fullWidth
              className="sm:w-auto"
              onClick={handlePublishClick}
            >
              Publish My Book
            </Button>

            <Link href="/books">
              <Button
                size="lg"
                variant="outlined"
                color="gray"
                fullWidth
                className="sm:w-auto"
              >
                Explore Books
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="mt-10 grid gap-6 lg:mt-0">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle8.svg"
              className="rounded-lg shadow-md"
              alt="book"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle9.svg"
              className="rounded-lg shadow-md sm:-mt-10 lg:-mt-28"
              alt="book"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle10.svg"
              className="rounded-lg shadow-md sm:-mt-6 lg:-mt-14"
              alt="book"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle11.svg"
              className="rounded-lg shadow-md sm:-mt-8 lg:-mt-20"
              alt="book"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            <div className="hidden lg:block"></div>

            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle12.svg"
              className="rounded-lg shadow-md sm:-mt-10 lg:-mt-28"
              alt="book"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle13.svg"
              className="rounded-lg shadow-md sm:-mt-6 lg:-mt-14"
              alt="book"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle14.svg"
              className="rounded-lg shadow-md sm:-mt-8 lg:-mt-20"
              alt="book"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
