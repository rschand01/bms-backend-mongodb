import mongoose from "mongoose";

export const userPasswordResetBlacklistTokenSchema = new mongoose.Schema(
  {
    userPasswordResetBlacklistToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
