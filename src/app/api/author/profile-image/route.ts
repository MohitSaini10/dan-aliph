import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

function getToken(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function PATCH(req: Request) {
  try { 
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET missing" },
        { status: 500 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      );
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(
        { message: "imageUrl required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { profileImage: imageUrl },
      { new: true }
    );

    console.log("✅ PROFILE IMAGE SAVED =>", updatedUser?.profileImage);

    return NextResponse.json({
      success: true,
      profileImage: updatedUser?.profileImage,
    });
  } catch (err) {
    console.error("PROFILE IMAGE PATCH ERROR =>", err);
    return NextResponse.json(
      { message: "Failed to update profile image" },
      { status: 500 }
    );
  }
}
