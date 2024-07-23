import { SALT } from "../constant/constant.mjs";
import { accessTokenSchema } from "./access.token.schema.mjs";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { refreshTokenSchema } from "./refresh.token.schema.mjs";
import slugify from "slugify";
import { userLogoutBlacklistTokenSchema } from "./user.logout.blacklist.token.schema.mjs";
import { userPasswordResetBlacklistTokenSchema } from "./user.password.reset.blacklist.token.schema.mjs";

export const signUpSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userIsVerified: { type: Boolean, default: false },
    age: { type: Number, default: null },
    profileImage: { type: String, default: null },
    phoneContact: { type: String, default: null },
    country: { type: String, default: null },
    accessToken: [accessTokenSchema],
    refreshToken: [refreshTokenSchema],
    userPasswordResetBlacklistToken: [userPasswordResetBlacklistTokenSchema],
    userLogoutBlacklistToken: [userLogoutBlacklistTokenSchema],
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

    const passwordHash = await bcrypt.hash(this.password, SALT);
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});
