import mongoose from "mongoose";

export const userConnectionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, ref: "User" },
});
