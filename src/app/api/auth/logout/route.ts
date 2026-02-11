import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url));

  // ✅ prevent caching (helps with back button showing admin)
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  // ✅ clear cookies
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  res.cookies.set("role", "", { path: "/", maxAge: 0 });

  return res;
}
