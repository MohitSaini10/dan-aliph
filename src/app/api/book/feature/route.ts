import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET() {
  try {
    await dbConnect();

    const books = await Book.find({
      isFeatured: true,
      status: "approved",
    })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(6);

    return NextResponse.json({ books }, { status: 200 });
  } catch (err) {
    console.log("FEATURED BOOKS ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
