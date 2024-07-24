import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { fileUploadMiddleware } from "../middleware/file.upload.middleware.mjs";
import multer from "multer";
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

    if (
      (value.email !== undefined && value.email !== null) ||
      (value.userName !== undefined && value.userName !== null)
    ) {
      const existingUsers = await UserModel.exists({
        $or: [
          { email: { $eq: value.email } },
          { userName: { $eq: value.userName } },
        ],
      });

      if (existingUsers) {
        return response.status(409).json({
          responseData:
            "Invalid email or username. Please enter a unique email and or username!",
        });
      }
    }

    let updateFields = {};
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

    const profileImageFilename = `profile-image-${existingUser.userName}`;

    await fileUploadMiddleware(request, response, profileImageFilename);

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
    if (error instanceof multer.MulterError) {
      return response.status(400).json({ responseData: error.message });
    }

    catchErrorUtility(error, response);
  }
};
