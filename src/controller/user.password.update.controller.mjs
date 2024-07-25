import { SALT, TEN_MINUTES_IN_SECONDS } from "../constant/constant.mjs";
import { UserModel } from "../model/model.mjs";
import bcrypt from "bcryptjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { redisClient } from "../store/redis.client.store.mjs";
import { userPasswordUpdateValidator } from "../validator/user.password.update.validator.mjs";

export const userPasswordUpdateController = async (request, response) => {
  const { error, value } = userPasswordUpdateValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { currentPassword, newPassword, userData } = value;

  try {
    const existingUser = await UserModel.findOne({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const maxPasswordAttempt = 5;
    const currentPasswordAttempt = await redisClient.hGet(
      existingUser.email,
      "currentAttempt"
    );

    if (currentPasswordAttempt === null) {
      await redisClient.hSet(existingUser.email, "currentAttempt", 0);
    }

    if (currentPasswordAttempt >= maxPasswordAttempt) {
      return response.status(403).json({
        responseData:
          "Maximum incorrect password attempts reached. Please try again in a few minutes!",
      });
    }

    if (!(await bcrypt.compare(currentPassword, existingUser.password))) {
      await redisClient.hIncrBy(existingUser.email, "currentAttempt", 1);
      await redisClient.expire(existingUser.email, TEN_MINUTES_IN_SECONDS);

      return response
        .status(403)
        .json({ responseData: "Invalid password. Please try again!" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT);

    await existingUser.updateOne({ password: newPasswordHash });
    return response
      .status(200)
      .json({ responseData: "Password has been successfully updated!" });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
