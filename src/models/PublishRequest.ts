import mongoose from "mongoose";

const PublishRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      default: "services-page",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  {
    timestamps: true,
    collection: "publish_requests",
  }
);

export const PublishRequest =
  mongoose.models.PublishRequest ||
  mongoose.model("PublishRequest", PublishRequestSchema);

export default PublishRequest;
