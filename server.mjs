import { config as dotenvConfig } from "dotenv";
import express from "express";
import { logger } from "./src/config/logger.config.mjs";

const app = express();
dotenvConfig();

try {
  app.use(express.json());

  app.listen(process.env.EXPRESS_PORT, () => {
    logger.log({
      level: "info",
      message: "Express Server is successfully listening!",
      additional: `port: ${process.env.EXPRESS_PORT}`,
    });
  });
} catch (error) {
  logger.log({
    level: "error",
    message: error.message,
    additional: error.stack,
  });
}
