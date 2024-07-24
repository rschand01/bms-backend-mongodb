import { BlogModel, UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";

export const blogDeleteController = async (request, response) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { userData } = value;
  const { blogSlug } = request.params;

  try {
    const existingUser = await UserModel.exists({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const existingBlog = await BlogModel.findOne({
      $and: [
        { userId: { $eq: existingUser._id } },
        { blogSlug: { $eq: blogSlug } },
      ],
    });

    if (!existingBlog) {
      return response.status(404).json({
        responseData: `Blog not found!`,
      });
    }

    await BlogModel.findOneAndDelete({
      userId: existingUser._id,
      blogSlug: blogSlug,
    });

    return response.status(200).json({
      responseData: `Blog ${existingBlog.blogTitle} has been successfully deleted!`,
    });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
