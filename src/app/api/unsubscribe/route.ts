import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    const subscriber = await Subscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      );
    }

    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json({
      message: "You have been unsubscribed successfully",
    });
  } catch (error) {
    console.log("UNSUBSCRIBE ERROR =>", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
