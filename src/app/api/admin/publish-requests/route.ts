import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import PublishRequest from "@/models/PublishRequest";
import { User } from "@/models/User";

function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// =====================
// GET → list requests
// =====================
export async function GET(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT_SECRET missing" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const requests = await PublishRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ requests }, { status: 200 });
  } catch (err) {
    console.log("ADMIN PUBLISH REQUESTS GET ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =====================
// PATCH → update status
// =====================
export async function PATCH(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT_SECRET missing" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ message: "id & status required" }, { status: 400 });
    }

    const updated = await PublishRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ request: updated }, { status: 200 });
  } catch (err) {
    console.log("ADMIN PUBLISH REQUEST PATCH ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =====================
// DELETE → remove spam
// =====================
export async function DELETE(req: Request) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT_SECRET missing" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "id required" }, { status: 400 });
    }

    await PublishRequest.findByIdAndDelete(id);
    return NextResponse.json({ message: "Request deleted" }, { status: 200 });
  } catch (err) {
    console.log("ADMIN PUBLISH REQUEST DELETE ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
