import mongoose from "mongoose";

export const userLogoutBlacklistTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);
