import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { userProfileUpdateValidator } from "../validator/user.profile.update.validator.mjs";

export const userProfileUpdateController = async (request, response) => {
  const { error, value } = userProfileUpdateValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  try {
    const existingUser = await UserModel.findOne({
      email: { $eq: value.userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const updateFields = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "userName",
      "email",
      "age",
      "profileImage",
      "phoneContact",
      "country",
    ];

    for (const field of allowedFields) {
      if (value[field] !== undefined && value[field] !== null) {
        updateFields[field] = value[field];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return response.status(403).json({
        responseData:
          "Update unsuccessful. Please provide information to update!",
      });
    }

    await existingUser.updateOne(updateFields);
    return response
      .status(200)
      .json({ responseData: "Account information update successful!" });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
