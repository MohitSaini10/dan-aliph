import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";

function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT_SECRET missing" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const authorId = new mongoose.Types.ObjectId(decoded.id);

    const total = await Book.countDocuments({ authorId });
    const pending = await Book.countDocuments({ authorId, status: "pending" });
    const approved = await Book.countDocuments({ authorId, status: "approved" });
    const rejected = await Book.countDocuments({ authorId, status: "rejected" });

    // ✅ Recent 5 books
    const recent = await Book.find({ authorId })
      .select("title status createdAt category")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(
      { total, pending, approved, rejected, recent },
      { status: 200 }
    );
  } catch (err) {
    console.log("AUTHOR STATS ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
