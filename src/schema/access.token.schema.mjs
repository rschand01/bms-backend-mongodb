import mongoose from "mongoose";

export const accessTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true },
  },
  { timestamps: true }
);
