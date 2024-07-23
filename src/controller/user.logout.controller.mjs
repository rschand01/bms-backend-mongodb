import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";

export const userLogoutController = async (request, response) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const accessToken = request.headers.authorization;
  const refreshToken = request.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return response
      .status(400)
      .json({ responseData: "Authentication token is not found!" });
  }

  const { userData } = value;

  try {
    const existingUser = await UserModel.findOne({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const existingUserLogoutBlacklistToken =
      existingUser.userLogoutBlacklistToken.some(
        (token) =>
          token.accessToken === accessToken ||
          token.refreshToken === refreshToken
      );

    if (existingUserLogoutBlacklistToken) {
      return response.status(403).json({
        responseData: "Logout unsuccessful. Please try again later!",
      });
    }

    existingUser.userLogoutBlacklistToken.push({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    await existingUser.save();

    response
      .status(200)
      .header("Authorization", "")
      .cookie("refreshToken", "")
      .json({ responseData: "Logout Successful!" });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
