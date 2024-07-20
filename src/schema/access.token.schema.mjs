import { ONE_HOUR_IN_SECONDS } from "../constant/constant.mjs";
import mongoose from "mongoose";

export const accessTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true, unique: true },
    createdAt: { type: Date, expires: ONE_HOUR_IN_SECONDS },
  },
  { timestamps: true }
);
