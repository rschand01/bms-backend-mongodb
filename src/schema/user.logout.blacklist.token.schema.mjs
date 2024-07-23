import mongoose from "mongoose";

export const userLogoutBlacklistTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
