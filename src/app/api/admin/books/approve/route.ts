import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";
import { sendNewBookPublishedEmail } from "@/lib/sendNewBookEmail";

// 🔐 Token helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// ===============================
// ✅ GET → Approved Books List
// ===============================
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

    await dbConnect();

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const books = await Book.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ books }, { status: 200 });
  } catch (err) {
    console.log("APPROVED BOOKS GET ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =====================================
// ✅ POST → Approve + Publish Book
//     + AUTO EMAIL TO SUBSCRIBERS
// =====================================
export async function POST(req: Request) {
  try {
    // ---------------- AUTH ----------------
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

    // ---------------- BODY ----------------
    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { message: "bookId is required" },
        { status: 400 }
      );
    }

    // ---------------- UPDATE BOOK ----------------
    const book = await Book.findByIdAndUpdate(
      bookId,
      {
        status: "approved",
        isPublished: true,
        approvedAt: new Date(),
        publishedAt: new Date(),
      },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    // ---------------- AUTO EMAIL ----------------
    try {
      await sendNewBookPublishedEmail(book);
    } catch (emailErr) {
      console.log("NEW BOOK EMAIL ERROR =>", emailErr);
      // ❗ email fail hone par bhi approve success
    }

    // ---------------- RESPONSE ----------------
    return NextResponse.json(
      {
        message: "Book approved & published successfully",
        book,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("BOOK APPROVE POST ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
