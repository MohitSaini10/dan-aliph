import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    // 📧 Email to Admin
    await sendEmail({
      to: process.env.SMTP_FROM!,
      subject: "📩 New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    return NextResponse.json(
      { message: "Message sent successfully", contact },
      { status: 201 }
    );
  } catch (err) {
    console.log("CONTACT POST ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
