import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";

// 🔐 Token helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

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

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { bookId, reason } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { message: "bookId is required" },
        { status: 400 }
      );
    }

    const book = await Book.findByIdAndUpdate(
      bookId,
      {
        status: "rejected",
        rejectionReason: reason?.trim() || "Rejected by admin",

        // 🔥 reset publish state
        isPublished: false,
        publishedAt: null,
        approvedAt: null,

        // 🔥 reset landing controls
        isFeatured: false,
        featuredOrder: 0, 
      },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Book rejected successfully", book },
      { status: 200 }
    );
  } catch (err) {
    console.log("ADMIN BOOK REJECT ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
