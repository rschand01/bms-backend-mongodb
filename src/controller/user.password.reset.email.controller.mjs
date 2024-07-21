import { USER_PASSWORD_RESET_EMAIL_TEMPLATE } from "../constant/constant.mjs";
import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { emailSenderUtility } from "../utility/email.sender.utility.mjs";
import { emailValidator } from "../validator/email.validator.mjs";
import jwt from "jsonwebtoken";

export const userPasswordResetEmailController = async (request, response) => {
  const { error, value } = emailValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { email } = value;

  try {
    const existingUser = await UserModel.findOne({ email: { $eq: email } });

    if (!existingUser) {
      return response.status(404).json({
        responseData:
          "User not found. Please ensure that you are entering the correct email address!",
      });
    }

    const passwordResetToken = jwt.sign(
      { userData: email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const passwordResetLink = `${process.env.WEBSITE_URL}?token=${passwordResetToken}`;

    const emailIsSent = await emailSenderUtility(
      USER_PASSWORD_RESET_EMAIL_TEMPLATE,
      existingUser.firstName,
      existingUser.lastName,
      passwordResetLink,
      email,
      "Password Reset Link"
    );

    if (emailIsSent) {
      return response.status(200).json({
        responseData:
          "A password reset link has been successfully sent to your email address. Please open your email inbox, click on the provided link and follow through!",
      });
    }

    return response
      .status(400)
      .json({ responseData: "Password reset failed!" });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
