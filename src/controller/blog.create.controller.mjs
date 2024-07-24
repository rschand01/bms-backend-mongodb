import { BlogModel, UserModel } from "../model/model.mjs";
import { blogDataValidator } from "../validator/blog.data.validator.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";

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

    const existingUserBlog = await BlogModel.findOne({
      _id: { $eq: existingUser._id },
    });

    if (
      existingUserBlog &&
      existingUserBlog.blogData &&
      existingUserBlog.blogData.some((data) => data.blogTitle === blogTitle)
    ) {
      return response.status(409).json({
        responseData: `Blog with title ${blogTitle} already exists. Please choose a different blog title!`,
      });
    }

    const blogData = {
      blogTitle,
      blogSlug: blogTitle,
      blogContent,
      blogImage: blogImage ?? null,
      blogAuthor,
    };

    if (!existingUserBlog) {
      await BlogModel.create({ _id: existingUser._id, blogData });
    } else {
      existingUserBlog.blogData.push(blogData);
      await existingUserBlog.save();
    }

    return response.status(201).json({
      responseData: `Blog ${blogTitle} has been successfully created!`,
    });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
