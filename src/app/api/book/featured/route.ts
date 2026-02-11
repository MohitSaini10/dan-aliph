import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = 10; // ✅ 10 books per page
    const skip = (page - 1) * limit;

    const query = {
      isFeatured: true,
      status: "approved",
    };

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ featuredOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Book.countDocuments(query),
    ]);

    const safeBooks = books.map((b: any) => ({
      _id: b._id,
      title: b.title,
      category: b.category,
      description: b.description,
      coverImage: b.coverImage,
      price: b.price,
      authorName: b.authorName,
      buyLinks: b.buyLinks,

      // ✅ Free book → pdfUrl allowed, Paid → hidden
      pdfUrl: b.price > 0 ? "" : b.bookUrl,
    }));

    return NextResponse.json(
      {
        books: safeBooks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("FEATURED BOOKS ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
