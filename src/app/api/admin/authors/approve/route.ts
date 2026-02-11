import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded?.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ message: "userId required" }, { status: 400 });

    await dbConnect();

    await User.findByIdAndUpdate(userId, {
      role: "author",
      authorRequest: false,
    });

    return NextResponse.json({ message: "Author approved" });
  } catch (err) {
    console.log("AUTHOR APPROVE ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
