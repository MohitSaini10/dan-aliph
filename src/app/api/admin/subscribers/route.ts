import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { User } from "@/models/User";

// 🔐 Token helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET missing" },
        { status: 500 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    return NextResponse.json(
      {
        total: subscribers.length,
        subscribers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ADMIN SUBSCRIBERS ERROR =>", error);
    return NextResponse.json(
      { message: "Failed to load subscribers" },
      { status: 500 }
    );
  }
}
