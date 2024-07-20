import { UserModel } from "../model/model.mjs";
import bcrypt from "bcryptjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import jwt from "jsonwebtoken";
import { signInValidator } from "../validator/signin.validator.mjs";

export const signInController = async (request, response) => {
  const { error, value } = signInValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { email, userName, password } = value;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email: { $eq: email } }, { userName: { $eq: userName } }],
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return response.status(401).json({
        responseData: "Invalid account credentials. Please try again!",
      });
    }

    const userData = {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      userName: existingUser.userName,
      email: existingUser.email,
    };

    const accessToken = jwt.sign({ userData }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userData: userData },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const existingAccessToken = existingUser.accessToken.some(
      (token) => token.accessToken === accessToken
    );

    const existingRefreshToken = existingUser.refreshToken.some(
      (token) => token.refreshToken === refreshToken
    );

    if (existingAccessToken || existingRefreshToken) {
      return response
        .status(403)
        .json({ responseData: "Login unsuccessful. Please try again later!" });
    }

    existingUser.accessToken.push({ accessToken: accessToken });
    existingUser.refreshToken.push({ refreshToken: refreshToken });
    await existingUser.save();

    return response
      .status(200)
      .header("Authorization", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        responseData: `Sign in successful. Welcome ${existingUser.firstName} ${existingUser.lastName}`,
      });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
