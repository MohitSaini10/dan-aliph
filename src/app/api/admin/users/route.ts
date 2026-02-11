import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

function getAdminFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as any;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const decoded = getAdminFromToken();

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const users = await User.find({ role: { $ne: "admin" } })
      .select("_id name email role isBlocked createdAt")  
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
