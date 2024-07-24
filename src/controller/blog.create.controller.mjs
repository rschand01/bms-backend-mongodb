import { BlogModel, UserModel } from "../model/model.mjs";
import { blogDataValidator } from "../validator/blog.data.validator.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { fileUploadMiddleware } from "../middleware/file.upload.middleware.mjs";
import multer from "multer";

export const blogCreateController = async (request, response) => {
  const { error, value } = blogDataValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { blogTitle, blogContent, blogImage, blogAuthor, userData } = value;

  try {
    const existingUser = await UserModel.exists({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const existingBlogs = await BlogModel.exists({
      $and: [
        { userId: { $eq: existingUser._id } },
        { blogTitle: { $eq: blogTitle } },
      ],
    });

    if (existingBlogs) {
      return response.status(409).json({
        responseData: `Blog with title ${blogTitle} already exists. Please choose a different blog title!`,
      });
    }

    await fileUploadMiddleware(request, response, "blog-image");

    await BlogModel.create({
      userId: existingUser._id,
      blogTitle,
      blogSlug: blogTitle,
      blogContent,
      blogImage: blogImage ?? null,
      blogAuthor,
    });

    return response.status(201).json({
      responseData: `Blog ${blogTitle} has been successfully created!`,
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return response.status(400).json({ responseData: error.message });
    }

    catchErrorUtility(error, response);
  }
};
