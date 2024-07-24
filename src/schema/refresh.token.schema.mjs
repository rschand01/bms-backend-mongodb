import mongoose from "mongoose";

export const refreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);
