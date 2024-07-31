import { blogDataSchema } from "../schema/blog.data.schema.mjs";
import mongoose from "mongoose";
import { signUpSchema } from "../schema/signup.schema.mjs";
import { userSocialSchema } from "../schema/user.social.schema.mjs";

export const UserModel = mongoose.model("User", signUpSchema);
export const BlogModel = mongoose.model("Blog", blogDataSchema);
export const SocialModel = mongoose.model("Social", userSocialSchema);
