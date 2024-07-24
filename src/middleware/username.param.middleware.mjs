import { logger } from "../config/logger.config.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";

export const userNameParamMiddleware = (request, response, next) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { userData } = value;
  const { userName } = request.params;

  try {
    if (userData.userName !== userName) {
      return response.status(404).json({ responseData: "User not found!" });
    }

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
