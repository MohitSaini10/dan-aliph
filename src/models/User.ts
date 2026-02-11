import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },

    authorRequest: { type: Boolean, default: false },

    isBlocked: { type: Boolean, default: false },

    // 🔐 Reset password
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date, default: null },

    // ✅ NEW: Author / User Profile Image (Cloudflare URL)
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
