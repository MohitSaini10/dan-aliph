import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // ✅ basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // ✅ check if already subscribed
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      // already subscribed but inactive → re-activate
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();

        return NextResponse.json({
          message: "You are subscribed again 🎉",
        });
      }

      return NextResponse.json({
        message: "You are already subscribed",
      });
    }

    // ✅ generate unsubscribe token
    const unsubscribeToken = crypto
      .randomBytes(32)
      .toString("hex");

    await Subscriber.create({
      email,
      source: "footer",
      unsubscribeToken,
      isActive: true,
    });

    return NextResponse.json(
      { message: "Subscribed successfully 🎉" },
      { status: 201 }
    );
  } catch (error) {
    console.log("SUBSCRIBE ERROR =>", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
