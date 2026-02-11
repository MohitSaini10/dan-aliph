import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {dbConnect} from "@/lib/mongodb";
import {User} from "@/models/User";
import Book from "@/models/Book";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments({});
    const totalAuthors = await User.countDocuments({ role: "author" });
    const totalBooks = await Book.countDocuments({});

    return NextResponse.json({
      totalUsers,
      totalAuthors,
      totalBooks,
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
