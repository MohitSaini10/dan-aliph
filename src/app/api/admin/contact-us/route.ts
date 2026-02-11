import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/mailer";

function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// =====================
// GET → list contacts
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

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (err) {
    console.log("ADMIN CONTACT GET ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =====================
// DELETE → remove contact
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

    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Contact deleted" }, { status: 200 });
  } catch (err) {
    console.log("ADMIN CONTACT DELETE ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =====================
// POST → reply via email
// =====================
export async function POST(req: Request) {
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

    const { id, reply } = await req.json();
    if (!id || !reply) {
      return NextResponse.json(
        { message: "id & reply required" },
        { status: 400 }
      );
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    // 📧 send reply email
    await sendEmail({
      to: contact.email,
      subject: "Reply from Dan Aliph",
      html: `
        <p>Hi ${contact.name},</p>
        <p>${reply}</p>
        <br/>
        <p>Regards,<br/>Dan Aliph Team</p>
      `,
    });

    contact.status = "replied";
    await contact.save();

    return NextResponse.json(
      { message: "Reply sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("ADMIN CONTACT REPLY ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
