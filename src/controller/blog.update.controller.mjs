import { BlogModel, UserModel } from "../model/model.mjs";
import { blogDataUpdateValidator } from "../validator/blog.data.update.validator.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { fileUploadMiddleware } from "../middleware/file.upload.middleware.mjs";
import multer from "multer";
import slugify from "slugify";

export const blogUpdateController = async (request, response) => {
  const { error, value } = blogDataUpdateValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { blogTitle, blogContent, blogImage, blogAuthor, userData } = value;
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

    if (
      existingBlog.userId === existingUser._id.toString() &&
      existingBlog.blogTitle === blogTitle
    ) {
      return response.status(409).json({
        responseData: `Blog with title ${blogTitle} already exists. Please choose a different blog title!`,
      });
    }

    await fileUploadMiddleware(request, response, "blog-image");

    const newBlogSlug = slugify(blogTitle, { lower: true, strict: true });

    await existingBlog.updateOne({
      blogTitle,
      blogSlug: newBlogSlug,
      blogContent,
      blogImage: blogImage,
      blogAuthor,
    });

    return response
      .status(200)
      .json({ responseData: "Blog has been successfully updated!" });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return response.status(400).json({ responseData: error.message });
    }

    catchErrorUtility(error, response);
  }
};
