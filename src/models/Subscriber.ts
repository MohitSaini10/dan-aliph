import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    source: {
      type: String,
      default: "footer", // future: popup, landing-page etc.
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Unsubscribe support
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "subscribers",
  }
);

// ✅ Avoid model overwrite in Next.js
export const Subscriber =
  mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);

export default Subscriber;
