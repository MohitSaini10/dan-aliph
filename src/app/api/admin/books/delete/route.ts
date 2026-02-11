import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";
import { deleteFromR2 } from "@/lib/r2";
import { getR2KeyFromUrl } from "@/lib/getR2KeyFromUrl";

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

    // 🔒 ADMIN ONLY
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { message: "bookId is required" },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    // 🔥 Delete Cloudflare R2 files
    if (book.coverImage) {
      await deleteFromR2(getR2KeyFromUrl(book.coverImage));
    }

    if (book.bookUrl) {
      await deleteFromR2(getR2KeyFromUrl(book.bookUrl));
    }

    // 🔥 Delete MongoDB record
    await Book.findByIdAndDelete(bookId);

    return NextResponse.json(
      { message: "Book deleted successfully (DB + Cloudflare)" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN BOOK DELETE ERROR =>", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
