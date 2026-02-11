import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { userId, block } = await req.json();

    if (!userId || typeof block !== "boolean") {
      return NextResponse.json(
        { message: "userId and block(boolean) required" },
        { status: 400 }
      );
    }

    if (decoded?.id === userId) {
      return NextResponse.json(
        { message: "You cannot block yourself" },
        { status: 400 }
      );
    }

    await dbConnect();

    await User.findByIdAndUpdate(userId, { isBlocked: block });

    return NextResponse.json({ message: "Updated", block });
  } catch (err: any) {
    console.log("BLOCK API ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
