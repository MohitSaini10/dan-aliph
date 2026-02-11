import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Protect AUTHOR dashboard routes
  if (pathname.startsWith("/author/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (decoded?.role !== "author") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Protect ADMIN routes
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (decoded?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ If already logged in and trying to open login/register
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      // If admin logged in → go admin
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded?.role === "admin") {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        if (decoded?.role === "author") {
          return NextResponse.redirect(new URL("/author/dashboard", req.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Run middleware only on these routes
export const config = {
  matcher: [
    "/author/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
