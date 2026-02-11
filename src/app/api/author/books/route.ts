import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";
import slugify from "slugify";

// 🔐 Token cookie helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// ==========================
// ✅ GET → Author Books List
// ==========================
export async function GET(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET missing" },
        { status: 500 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await dbConnect();

    const authorId = new mongoose.Types.ObjectId(decoded.id);

    const books = await Book.find({ authorId })
      .sort({ createdAt: -1 })
      .select("-__v");

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("AUTHOR BOOKS GET ERROR =>", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =================================
// ✅ POST → Author Submit New Book
// =================================
export async function POST(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET missing" },
        { status: 500 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "author") {
      return NextResponse.json(
        { message: "Only authors can add books" },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("AUTHOR BOOK BODY =>", body);

    const {
      title,
      category,
      price,
      language,
      description,
      coverImage, // ✅ Cloudflare image URL
      pdfUrl,     // ✅ Cloudflare PDF URL (frontend se)
    } = body;

    // 🔎 Validation (slug hata diya)
    if (!title || !category || !coverImage || !pdfUrl) {
      return NextResponse.json(
        { message: "Title, category & cover image & PDF are required" },
        { status: 400 }
      );
    }

    // 🔥 Auto-generate slug
    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // 🔁 Ensure unique slug (english, english-1, english-2 ...)
    let uniqueSlug = slug;
    let count = 1;

    while (await Book.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    // 💾 Save to MongoDB
    const book = await Book.create({
      title,
      slug: uniqueSlug, // ✅ auto + unique
      category,
      price: Number(price) || 0,
      language: language || "English",
      description: description || "",

      coverImage,
      bookUrl: pdfUrl, 

      authorId: user._id,
      authorName: user.name || "",
      authorEmail: user.email || "",

      status: "pending",
      isPublished: false,
    });

    return NextResponse.json(
      {
        message: "Book submitted successfully (waiting for admin approval)",
        book,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AUTHOR BOOK POST ERROR =>", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
