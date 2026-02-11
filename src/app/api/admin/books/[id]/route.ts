import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Book from "@/models/Book";
import { User } from "@/models/User";

// 🔐 Token helper
function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// ===================================
// ✅ GET → Single Book (Admin Edit)
// ===================================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.log("ADMIN GET BOOK ERROR =>", error);
    return NextResponse.json(
      { message: "Failed to load book" },
      { status: 500 }
    );
  }
}

// ===================================
// ✅ PATCH → Update Book (Admin Only)
// ===================================
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const body = await req.json();
    const {
      price,
      featuredOrder,
      title,
      category,
      description,
      language,
      isFeatured,
      buyLinks,
    } = body;

    const updateData: any = {};

    if (price !== undefined) updateData.price = Number(price);
    if (featuredOrder !== undefined)
      updateData.featuredOrder = Number(featuredOrder);

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (language !== undefined) updateData.language = language;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

    if (buyLinks !== undefined) {
  updateData.buyLinks = {
    amazon: buyLinks?.amazon || "",
    flipkart: buyLinks?.flipkart || "",
  };
}


    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    // ---------------- UPDATE ----------------
    const updatedBook = await Book.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBook) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, book: updatedBook },
      { status: 200 }
    );
  } catch (error) {
    console.log("ADMIN UPDATE ERROR =>", error);
    return NextResponse.json(
      { message: "Failed to update book" },
      { status: 500 }
    );
  }
}
