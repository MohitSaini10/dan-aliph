import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email & password required" },
        { status: 400 }
      );
    }

    // ✅ Make sure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET missing in .env.local" },
        { status: 500 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ NEW: Blocked user cannot login
    if (user.isBlocked) {
      return NextResponse.json(
        { message: "Your account has been blocked by admin." },
        { status: 403 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { message: "Password not set for this user" },
        { status: 500 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    const res = NextResponse.json({
      message: "Login success",
      role: user.role,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge:  60 * 24 * 4,
    });

    res.cookies.set("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 24 * 4,
    });

    return res;
  } catch (err) {
    console.log("LOGIN API ERROR =>", err); // ✅ IMPORTANT
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 }
    );
  }
}
