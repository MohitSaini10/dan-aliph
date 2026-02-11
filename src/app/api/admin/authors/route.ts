import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded?.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();

    const requests = await User.find({ authorRequest: true })
      .select("_id name email phone role authorRequest createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (err) {
    console.log("ADMIN AUTHORS GET ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
