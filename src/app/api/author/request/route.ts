import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    await dbConnect();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "author") {
      return NextResponse.json({ message: "Already an author" }, { status: 400 });
    }

    if (user.authorRequest === true) {
      return NextResponse.json(
        { message: "Request already pending" },
        { status: 400 }
      );
    }

    user.authorRequest = true;
    await user.save();

    return NextResponse.json({ message: "Author request sent" }, { status: 200 });
  } catch (err: any) {
    console.log("AUTHOR REQUEST ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
