import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {dbConnect } from "@/lib/mongodb";
import {User} from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded?.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { userId, name, email } = await req.json();
    if (!userId) return NextResponse.json({ message: "userId required" }, { status: 400 });

    await dbConnect();

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    return NextResponse.json({ message: "User updated", user: updated });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
