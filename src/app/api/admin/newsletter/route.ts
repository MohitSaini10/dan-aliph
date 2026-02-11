import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/mailer";
import { newsletterTemplate } from "@/lib/emailTemplates";

// 🔐 Token helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    // ---------------- AUTH ----------------
    const token = getTokenFromCookie(req);
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

    await dbConnect();

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ---------------- BODY ----------------
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title & content required" },
        { status: 400 }
      );
    }

    // ---------------- SUBSCRIBERS ----------------
    const subscribers = await Subscriber.find({ isActive: true });

    let sentCount = 0;

    for (const sub of subscribers) {
      await sendEmail({
        to: sub.email,
        subject: title,
        html: newsletterTemplate(
          title,
          content,
          sub.unsubscribeToken
        ),
      });

      sentCount++;
    }

    return NextResponse.json({
      message: `Newsletter sent to ${sentCount} subscribers`,
    });
  } catch (error) {
    console.log("NEWSLETTER ERROR =>", error);
    return NextResponse.json(
      { message: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
