import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as { id: string };

    if (!decoded?.id) {
      return NextResponse.json({ isLoggedIn: false });
    }

    await dbConnect();

    // 🔥 FETCH REAL USER FROM DB
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({
      isLoggedIn: true,
      id: user._id,
      name: user.name,
      userName: user.name, // backward compatibility
      email: user.email,
      role: user.role,

      // ✅ THIS FIXES PROFILE IMAGE ISSUE
      profileImage: user.profileImage || "",
    });
  } catch (err) {
    console.error("AUTH ME ERROR =>", err);
    return NextResponse.json({ isLoggedIn: false });
  }
}
