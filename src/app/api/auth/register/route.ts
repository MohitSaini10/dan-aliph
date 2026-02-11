import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ normalize inputs
    const name = (body?.name || "").trim();
    const email = (body?.email || "").trim().toLowerCase();
    const phone = (body?.phone || "").trim();
    const password = (body?.password || "").trim();

    // ✅ required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: "Name, email, phone, password required" },
        { status: 400 }
      );
    }

    // ✅ phone validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "Phone must be exactly 10 digits" },
        { status: 400 }
      );
    }

    // ✅ password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ already registered check
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone, // ✅ required
      passwordHash,

      role: "user",
      authorRequest: false,
      isBlocked: false,
    });

    return NextResponse.json(
      { message: "Registered successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.log("REGISTER API ERROR:", err);

    // ✅ unique index error protection
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
