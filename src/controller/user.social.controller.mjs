import { SocialModel, UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { updateUserConnectionUtility } from "../utility/update.user.connection.utility.mjs";
import { userSocialValidator } from "../validator/user.social.validator.mjs";

export const userSocialController = async (request, response) => {
  const { error, value } = userSocialValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { email, userId, userData } = value;

  try {
    const [existingUser, existingUserToFollowOrUnfollow] = await Promise.all([
      UserModel.findOne({
        email: { $eq: userData.email },
      }),

      UserModel.findOne({
        $and: [{ email: { $eq: email } }, { _id: { $eq: userId } }],
      }),
    ]);

    if (!existingUser || !existingUserToFollowOrUnfollow) {
      return response.status(404).json({
        responseData:
          "OOPS! Something happened on our end. Please wait for a while and try again!",
      });
    }

    await SocialModel.findOneAndUpdate(
      { _id: existingUser._id },
      { _id: existingUser._id },
      { upsert: true }
    );

    await updateUserConnectionUtility(
      SocialModel,
      email,
      userId,
      existingUser,
      existingUserToFollowOrUnfollow,
      response
    );
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
