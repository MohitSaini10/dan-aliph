import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { authorId: string } }
) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(params.authorId)) {
      return NextResponse.json(
        { message: "Invalid author id" },
        { status: 400 }
      );
    }

    const query = {
      authorId: new mongoose.Types.ObjectId(params.authorId),
      status: "approved",
      isPublished: true,
    };

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const safeBooks = books.map((b: any) => ({
      _id: b._id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      description:b.description,
      coverImage: b.coverImage,
      price: b.price,
      buyLinks: b.buyLinks,
      authorId: b.authorId,
      authorName: b.authorName,
      pdfUrl: b.price > 0 ? "" : b.bookUrl,
    }));

    return NextResponse.json({
      authorName: books[0]?.authorName || "",
      books: safeBooks,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("AUTHOR BOOKS PUBLIC ERROR =>", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
