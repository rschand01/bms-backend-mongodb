import { UserModel } from "../model/model.mjs";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger.config.mjs";

export const accountVerificationController = async (request, response) => {
  const { token } = request.query;

  try {
    const userPayload = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const existingUser = await UserModel.findOne({
      email: { $eq: userPayload.userData },
    });

    if (!existingUser) {
      return response.status(403).json({ responseData: "Forbidden!" });
    }

    if (existingUser.userIsVerified) {
      return response
        .status(409)
        .json({ responseData: "Account already verified!" });
    }

    await existingUser.updateOne({ userIsVerified: true });

    return response
      .status(200)
      .json({ responseData: "Account verification successful!" });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
      additional: error.stack,
    });

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({ responseData: error.message });
    }

    return response
      .status(500)
      .json({ responseData: "Internal server error!" });
  }
};
