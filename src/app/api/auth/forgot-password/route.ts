import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // ✅ Always return success (security)
    if (!user) {
      return NextResponse.json(
        { message: "If email exists, reset link sent." },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // ✅ Send Email
    await sendEmail({
      to: user.email,
      subject: "Reset your DanaLiph Password",
      html: `
        <div style="background:#f6f7fb;padding:30px 0;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

            <div style="background:linear-gradient(90deg,#0ea5e9,#14b8a6);padding:20px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:0.5px;">
                DanaLiph Publishing
              </h1>
              <p style="margin:6px 0 0;color:#e0f2fe;font-size:13px;">
                Publish • Print • Distribute
              </p>
            </div>

            <div style="padding:26px 24px;color:#111827;">
              <h2 style="margin:0 0 10px;font-size:20px;">Reset your password</h2>

              <p style="margin:0 0 14px;color:#374151;font-size:14px;line-height:1.6;">
                Hello <b>${user.name || "User"}</b>,<br />
                We received a request to reset your DanaLiph account password.
              </p>

              <p style="margin:0 0 18px;color:#374151;font-size:14px;line-height:1.6;">
                Click the button below to reset your password. This link will expire in <b>15 minutes</b>.
              </p>

              <div style="text-align:center;margin:26px 0;">
                <a href="${resetLink}"
                   style="background:#0f172a;color:#ffffff;padding:12px 22px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:10px 0 0;background:#f9fafb;border:1px dashed #d1d5db;border-radius:12px;padding:12px;color:#111827;font-size:12px;word-break:break-all;">
                ${resetLink}
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0;" />

              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </div>

            <div style="background:#f9fafb;padding:16px 24px;text-align:center;color:#6b7280;font-size:12px;">
              © ${new Date().getFullYear()} DanaLiph Publishing. All rights reserved.
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "If email exists, reset link sent." },
      { status: 200 }
    );
  } catch (err) {
    console.log("FORGOT PASSWORD ERROR =>", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
