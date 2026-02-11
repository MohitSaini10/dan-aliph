import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

function getToken(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// 🔧 R2 client
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    // unique filename
    const key = `profile-images/${crypto.randomUUID()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: "image/jpeg",
    });

    const uploadURL = await getSignedUrl(r2, command, {
      expiresIn: 60, // 1 min
    });

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadURL, publicUrl });
  } catch (err) {
    console.error("R2 UPLOAD URL ERROR =>", err);
    return NextResponse.json(
      { message: "Failed to get upload URL" },
      { status: 500 }
    );
  }
}
