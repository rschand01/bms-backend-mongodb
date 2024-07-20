import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";

export const userProfileViewController = async (request, response) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { userData } = value;

  try {
    const existingUser = await UserModel.findOne({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const newUserData = {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      userName: existingUser.userName,
      email: existingUser.email,
      age: existingUser.age,
      profileImage: existingUser.profileImage,
      phoneContact: existingUser.phoneContact,
      country: existingUser.country,
    };

    return response.status(200).json({ responseData: { ...newUserData } });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
