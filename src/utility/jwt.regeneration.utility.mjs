import { UserModel } from "../model/model.mjs";
import jwt from "jsonwebtoken";

export const jwtRegenerationUtility = async (request, response) => {
  const currentRefreshToken = request.cookies.refreshToken;

  if (!currentRefreshToken) {
    return response.status(401).json({ responseData: "Unauthorized!" });
  }

  try {
    const userData = await jwt.verify(
      currentRefreshToken,
      process.env.JWT_SECRET_KEY
    );

    const existingUser = await UserModel.findOne({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "User not found!" });
    }

    const newAccessToken = jwt.sign(
      { ...userData },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const newRefreshToken = jwt.sign(
      { ...userData },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const existingAccessToken = existingUser.accessToken.some(
      (token) => token.accessToken === newAccessToken
    );

    const existingRefreshToken = existingUser.refreshToken.some(
      (token) => token.refreshToken === newRefreshToken
    );

    if (existingAccessToken || existingRefreshToken) {
      return response.status(403).json({
        responseData: "Login unsuccessful. Please try again later!",
      });
    }

    existingUser.accessToken.push({ accessToken: newAccessToken });
    existingUser.refreshToken.push({ refreshToken: newRefreshToken });
    await existingUser.save();

    return response
      .status(200)
      .header("Authorization", newAccessToken)
      .cookie("refreshToken", newRefreshToken)
      .json({
        responseData: `Sign in successful. Welcome ${existingUser.firstName} ${existingUser.lastName}`,
      });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({ responseData: error.message });
    }
  }
};
