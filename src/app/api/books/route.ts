import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // 🔢 Pagination params
    const page = Math.max(
      1,
      Number(searchParams.get("page") || 1)
    );
    const q = (searchParams.get("q") || "").trim();

    const limit = 9;
    const skip = (page - 1) * limit;

    // 🔎 Base query
    const query: any = {
      status: "approved",
      isPublished: true,
    };

    // 🔍 Search (same pattern as AuthorBooks API)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { authorName: { $regex: q, $options: "i" } },
      ];
    }

    // 🔢 Total count (IMPORTANT)
    const total = await Book.countDocuments(query);

    // 📚 Fetch paginated books
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 🧼 Shape data exactly for frontend
    const safeBooks = books.map((b: any) => ({
      _id: b._id,
      title: b.title,
      category: b.category,
      description: b.description || "",
      coverImage: b.coverImage || "",
      price: Number(b.price || 0),
      buyLinks: b.buyLinks || {},

      // 👤 Author (denormalized)
      authorId: b.authorId,
      authorName: b.authorName || "Unknown Author",

      // 📘 Free book logic
      pdfUrl: b.price > 0 ? "" : b.bookUrl,
    }));

    return NextResponse.json({
      books: safeBooks,
      pagination: {
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        total,
      },
    });
  } catch (err) {
    console.error("ALL BOOKS ERROR =>", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
