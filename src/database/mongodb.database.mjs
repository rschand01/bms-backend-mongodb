import { logger } from "../config/logger.config.mjs";
import mongoose from "mongoose";

export const mongoDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    logger.log({
      level: "info",
      message: "Connection to MongoDB database have been established!",
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
      additional: error.stack,
    });
  }
};
