import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import PublishRequest from "@/models/PublishRequest";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: "Name, email and phone are required" },
        { status: 400 }
      );
    }

    // 💾 Save to DB
    const request = await PublishRequest.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      source: "services-page",
    });

    // 📧 Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: "📘 New Book Publish Request",
        html: `
          <h2>New Publish Request Received</h2>
          <p><strong>Name:</strong> ${request.name}</p>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Phone:</strong> ${request.phone}</p>
          <p><strong>Source:</strong> Services Page</p>
          <hr />
          <p>
            Please login to admin panel to follow up with this author.
          </p>
        `,
      });
    }

    return NextResponse.json(
      {
        message: "Publish request submitted successfully",
        requestId: request._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("PUBLISH REQUEST ERROR =>", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
