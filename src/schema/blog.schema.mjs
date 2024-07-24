import { blogDataSchema } from "./blog.data.schema.mjs";
import mongoose from "mongoose";

export const blogSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.ObjectId, ref: "User" },
    blogData: [blogDataSchema],
  },
  { timestamps: true }
);
