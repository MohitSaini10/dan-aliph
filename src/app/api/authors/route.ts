import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // 1️⃣ Get authors from books
    const authorsFromBooks = await Book.aggregate([
      {
        $match: {
          status: "approved",
          isPublished: true,
        },
      },
      {
        $group: {
          _id: "$authorId",
          totalBooks: { $sum: 1 },
        },
      },
    ]);

    if (authorsFromBooks.length === 0) {
      return NextResponse.json({ authors: [] });
    }

    // 2️⃣ Fetch user info (name + profileImage)
    const authorIds = authorsFromBooks.map((a) => a._id);

    const users = await User.find(
      { _id: { $in: authorIds } },
      { name: 1, profileImage: 1 }
    ).lean();

    const userMap = new Map(
      users.map((u: any) => [
        String(u._id),
        {
          name: u.name,
          profileImage: u.profileImage || "",
        },
      ])
    );

    // 3️⃣ Merge data
    const finalAuthors = authorsFromBooks.map((a) => {
      const user = userMap.get(String(a._id));

      return {
        authorId: a._id,
        name: user?.name || "Unknown Author",
        profileImage: user?.profileImage || "",
        totalBooks: a.totalBooks,
      };
    });

    return NextResponse.json({ authors: finalAuthors });
  } catch (err) {
    console.error("AUTHORS API ERROR =>", err);
    return NextResponse.json(
      { message: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
