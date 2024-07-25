import { SALT } from "../constant/constant.mjs";
import { UserModel } from "../model/model.mjs";
import bcrypt from "bcryptjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import jwt from "jsonwebtoken";
import { userPasswordResetValidator } from "../validator/user.password.reset.validator.mjs";

export const userPasswordResetController = async (request, response) => {
  const { error, value } = userPasswordResetValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { token } = request.query;
  const { password } = value;

  try {
    const userPayload = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const existingUser = await UserModel.findOne({
      email: { $eq: userPayload.userData },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    if (
      existingUser.userPasswordResetBlacklistToken.some(
        (jwtToken) => jwtToken.userPasswordResetBlacklistToken === token
      )
    ) {
      return response.status(403).json({
        responseData:
          "Password reset token has already been used. Please request forgot password to reset your password!",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT);

    await existingUser.updateOne({
      password: passwordHash,
      $push: {
        userPasswordResetBlacklistToken: {
          userPasswordResetBlacklistToken: token,
        },
      },
    });

    return response
      .status(200)
      .json({ responseData: "Password reset successful!" });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({ responseData: error.message });
    }

    catchErrorUtility(error, response);
  }
};
