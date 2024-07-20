import { ONE_DAY_IN_SECONDS } from "../constant/constant.mjs";
import mongoose from "mongoose";

export const refreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true, unique: true },
    createdAt: { type: Date, expires: ONE_DAY_IN_SECONDS },
  },
  { timestamps: true }
);
