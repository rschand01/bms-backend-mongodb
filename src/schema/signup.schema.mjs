import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import slugify from "slugify";

export const signUpSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userIsVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

signUpSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isModified("userName")) {
    return next();
  }

  try {
    const userNameSlug = slugify(this.userName, { lower: true, strict: true });
    this.userName = userNameSlug;

    const passwordHash = await bcrypt.hash(this.password, 10);
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});
