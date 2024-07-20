import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import jwt from "jsonwebtoken";
import { jwtRegenerationUtility } from "../utility/jwt.regeneration.utility.mjs";

export const verifyJwtMiddleware = async (request, response, next) => {
  const currentAccessToken = request.headers.authorization;

  if (!currentAccessToken) {
    return response.status(401).json({ responseData: "Unauthorized!" });
  }

  try {
    const userData = await jwt.verify(
      currentAccessToken,
      process.env.JWT_SECRET_KEY
    );

    request.body = { ...request.body, ...userData };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return response.status(401).json({ responseData: error.message });
    }

    if (error.name === "TokenExpiredError") {
      return jwtRegenerationUtility(request, response);
    }

    catchErrorUtility(error, response);
  }
};
