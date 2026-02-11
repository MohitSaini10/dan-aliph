import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    // ======================
    // 📘 Basic Info
    // ======================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,          // 🔥 important for /books/[slug]
      index: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    language: {
      type: String,
      default: "English",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================
    // ✍️ Author Info
    // ======================
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    authorName: {
      type: String,
      default: "",
      trim: true,
    },

    authorEmail: {
      type: String,
      default: "",
      index: true,
      trim: true,
    },

    // ======================
    // 🖼️ Media
    // ======================
    coverImage: {
      type: String,
      required: true,     // 🔥 Cloudflare image URL MUST
      trim: true,
    },

    bookUrl: {
      type: String,
      default: "",        // 🔥 PDF Cloudflare URL (optional)
      trim: true,
    },

    // ======================
    // 💰 Pricing
    // ======================
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================
    // 🛂 Admin Approval
    // ======================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    // ======================
    // 🚀 Publish Control
    // ======================
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // ======================
    // ⭐ Featured / Landing
    // ======================
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    featuredOrder: {
      type: Number,
      default: 0,
    },

    buyLinks: {
      amazon: { type: String, default: "" },
      flipkart: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    collection: "books",
  }
);

// ✅ Next.js hot-reload safe export
export const Book =
  mongoose.models.Book || mongoose.model("Book", BookSchema);

export default Book;
