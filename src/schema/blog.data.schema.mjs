import mongoose from "mongoose";
import slugify from "slugify";

export const blogDataSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User" },
    blogTitle: { type: String, required: true },
    blogSlug: { type: String, required: true },
    blogContent: { type: String, required: true },
    blogAuthor: { type: String, required: true },
    blogImage: { type: String, default: null },
  },
  { timestamps: true }
);

blogDataSchema.pre("save", async function (next) {
  if (!this.isModified("blogSlug")) {
    return next();
  }

  try {
    const blogSlug = slugify(this.blogSlug, { lower: true, strict: true });
    this.blogSlug = blogSlug;

    next();
  } catch (error) {
    next(error);
  }
});
