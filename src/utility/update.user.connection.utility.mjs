/**
 * @description Function to add or remove user (Follow/Unfollow) (Concurrent updates to users connecting with each other).
 * @param {mongoose.Model} SocialModel The social model.
 * @param {string} email The email of the user to follow.
 * @param {string} userId The id of the user to follow.
 * @param {mongoose.Document} existingUser The existing user aka currently logged in users required MongoDB documents.
 * @param {mongoose.Document} existingUserToFollowOrUnfollow The user to follow required MongoDB documents.
 * @param {Expression.Response} response Express response message.
 * @returns Express response message.
 */
export const updateUserConnectionUtility = async (
  SocialModel,
  email,
  userId,
  existingUser,
  existingUserToFollowOrUnfollow,
  response
) => {
  const userIsAConnection = await SocialModel.exists({
    "followers.email": { $eq: email },
  });

  if (!userIsAConnection) {
    // Follow User.
    await SocialModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: { $eq: existingUser._id } },
          update: {
            $push: { followers: { email } },
            $inc: { followerCount: 1 },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: { $eq: userId } },
          update: {
            $push: { followings: { email: existingUser.email } },
            $inc: { followingCount: 1 },
          },
        },
      },
    ]);

    return response.status(201).json({
      responseData: `Successfully followed ${existingUserToFollowOrUnfollow.firstName} ${existingUserToFollowOrUnfollow.lastName}`,
    });
  }

  // Unfollow User.
  await SocialModel.bulkWrite([
    {
      updateOne: {
        filter: { _id: { $eq: existingUser._id } },
        update: {
          $pull: { followers: { email } },
          $inc: { followerCount: -1 },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: { $eq: userId } },
        update: {
          $pull: { followings: { email: existingUser.email } },
          $inc: { followingCount: -1 },
        },
      },
    },
  ]);

  return response.status(200).json({
    responseData: `Successfully unfollowed ${existingUserToFollowOrUnfollow.firstName} ${existingUserToFollowOrUnfollow.lastName}`,
  });
};
