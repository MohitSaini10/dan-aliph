import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";

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

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const books = await Book.find({ status: "approved" }).sort({ createdAt: -1 });

    return NextResponse.json({ books }, { status: 200 });
  } catch (err) {
    console.log("APPROVED BOOKS ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
