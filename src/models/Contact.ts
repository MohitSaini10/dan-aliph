import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

export const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
