import { csrfValidator } from "../validator/csrf.validator.mjs";
import { logger } from "../config/logger.config.mjs";

export const csrfMiddleware = (request, response, next) => {
  const { error } = csrfValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  try {
    next();
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
