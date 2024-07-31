import mongoose from "mongoose";
import { userConnectionSchema } from "./user.connection.schema.mjs";

export const userSocialSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, ref: "User" },
  followers: [userConnectionSchema],
  followings: [userConnectionSchema],
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
});
