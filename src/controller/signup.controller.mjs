import { ACCOUNT_VERIFICATION_EMAIL_TEMPLATE } from "../constant/constant.mjs";
import { UserModel } from "../model/model.mjs";
import { emailSenderUtility } from "../utility/email.sender.utility.mjs";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger.config.mjs";
import { signUpValidator } from "../validator/signup.validator.mjs";

export const signUpController = async (request, response) => {
  const { error, value } = signUpValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { firstName, lastName, userName, email, password } = value;

  try {
    const existingUser = await UserModel.exists({
      $or: [{ email: { $eq: email } }, { userName: { $eq: userName } }],
    });

    if (existingUser) {
      return response.status(409).json({
        responseData: "Account already exists. Please login to continue!",
      });
    }

    const accountVerificationToken = jwt.sign(
      { userData: email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const accountVerificationLink = `${process.env.WEBSITE_URL}?token=${accountVerificationToken}`;

    const emailIsSent = await emailSenderUtility(
      ACCOUNT_VERIFICATION_EMAIL_TEMPLATE,
      firstName,
      lastName,
      accountVerificationLink,
      email,
      "Account Verification"
    );

    if (emailIsSent) {
      await UserModel.create({
        firstName,
        lastName,
        userName,
        email,
        password,
      });

      return response
        .status(201)
        .json({ responseData: "Account created successfully!" });
    }

    return response
      .status(400)
      .json({ responseData: "Account cannot be created!" });
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
