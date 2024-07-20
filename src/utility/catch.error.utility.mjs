import { logger } from "../config/logger.config.mjs";

/**
 * @description Utility function to log errors & return response.
 * @param {any} error The error object.
 * @param {Express.Response} response The response object.
 * @returns response.
 */
export const catchErrorUtility = (error, response) => {
  logger.log({
    level: "error",
    message: error.message,
    additional: error.stack,
  });

  return response.status(500).json({ responseData: "Internal server error!" });
};
