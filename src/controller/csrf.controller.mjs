import { logger } from "../config/logger.config.mjs";

export const csrfController = (request, response) => {
  const token = request.csrfToken();

  try {
    if (token === null || token === undefined) {
      return response
        .status(400)
        .json({ responseData: "CSRF token cannot be null or undefined!" });
    }

    if (!token) {
      return response
        .status(404)
        .json({ responseData: "CSRF token not found!" });
    }

    return response.status(200).header("CSRF", token).json({
      responseData:
        "Cross site request forgery token has been assigned to HTTP Header (csrf)!",
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
      additional: error.stack,
    });

    return response
      .status(500)
      .json({ responseData: "Internal server error!" });
  }
};
