import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";

function getToken(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await dbConnect();

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { bookId, isFeatured, featuredOrder } = await req.json();

    if (!bookId) {
      return NextResponse.json({ message: "bookId required" }, { status: 400 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    // ✅ if turning ON featured
    // ✅ FEATURE API – FIXED VERSION

if (Boolean(isFeatured) === true) {
  // turning ON featured
  const featuredCount = await Book.countDocuments({ isFeatured: true });

  if (!book.isFeatured && featuredCount >= 8) {
    return NextResponse.json(
      { message: "Maximum 8 featured books allowed" },
      { status: 400 }
    );
  }

  book.isFeatured = true;

  // ⚠️ IMPORTANT FIX:
  // order sirf tab set karo jab value aayi ho
  if (featuredOrder !== undefined && featuredOrder !== null) {
    book.featuredOrder = Number(featuredOrder);
  }
  // ❌ else kuch mat karo (existing order rehne do)
} else {
  // turning OFF featured
  book.isFeatured = false;
  book.featuredOrder = 0; // reset ONLY here
}

await book.save();


    return NextResponse.json({ message: "Updated", book }, { status: 200 });
  } catch (err) {
    console.log("FEATURE BOOK ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
