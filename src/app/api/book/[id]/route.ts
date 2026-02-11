import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const book = (await Book.findById(params.id).lean()) as any;
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const safeBook = {
      ...book,
      pdfUrl: book.price > 0 ? "" : book.pdfUrl, // ✅ hide if paid
    };

    return NextResponse.json(
      { success: true, book: safeBook },
      { status: 200 }
    );
  } catch (err) {
    console.log("SINGLE BOOK ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
