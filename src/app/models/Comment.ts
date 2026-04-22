import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    slug: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    is_approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
