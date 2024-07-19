import mongoose from "mongoose";
import { signUpSchema } from "../schema/signup.schema.mjs";

export const UserModel = mongoose.model("User", signUpSchema);
