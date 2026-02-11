import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (!["user", "author", "admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // ✅ safety: admin cannot change own role
    if (decoded?.id === userId) {
      return NextResponse.json(
        { message: "You cannot change your own role" },
        { status: 400 }
      );
    }

    await dbConnect();

    await User.findByIdAndUpdate(userId, { role });

    return NextResponse.json({ message: "Role updated" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
