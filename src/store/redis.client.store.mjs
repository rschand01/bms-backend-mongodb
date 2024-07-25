import { createClient } from "redis";
import { config as dotenvConfig } from "dotenv";
import { logger } from "../config/logger.config.mjs";

dotenvConfig();

export const redisClient = createClient({
  password: process.env.REDIS_CLIENT_PASSWORD,
  socket: {
    host: process.env.REDIS_CLIENT_HOST,
    port: process.env.REDIS_CLIENT_PORT,
  },
});

(async () => {
  try {
    await redisClient.connect();

    logger.log({
      level: "info",
      message: "Connection to Redis Data Store have been established!",
      additional: `port: ${process.env.REDIS_CLIENT_PORT}`,
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
      additional: error.stack,
    });
  }
})();
