import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `books/${Date.now()}-${file.name}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.log("R2 UPLOAD ERROR =>", err);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
