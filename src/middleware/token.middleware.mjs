import { logger } from "../config/logger.config.mjs";
import { tokenValidator } from "../validator/token.validator.mjs";

export const tokenMiddleware = (request, response, next) => {
  const { error } = tokenValidator.validate(request.query);

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
