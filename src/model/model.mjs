import mongoose from "mongoose";
import { signUpSchema } from "../schema/signup.schema.mjs";

export const User = mongoose.model("User", signUpSchema);
