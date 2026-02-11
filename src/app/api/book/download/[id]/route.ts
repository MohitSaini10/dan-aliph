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

    // 🔒 PAID => BLOCK DOWNLOAD
    if (book.price > 0) {
      return NextResponse.json(
        { message: "This book is paid. Please buy to download." },
        { status: 403 }
      );
    }

    // ✅ FREE => redirect to pdf file
    return NextResponse.redirect(new URL(book.pdfUrl, req.url));
  } catch (err) {
    console.log("DOWNLOAD BOOK ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
