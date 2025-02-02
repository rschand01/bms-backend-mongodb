import {
  BLOGS_PER_PAGE,
  CURRENT_PAGE,
  TWENTY_MINUTES_IN_SECONDS,
} from "../constant/constant.mjs";
import { BlogModel, UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";
import { redisClient } from "../store/redis.client.store.mjs";

export const blogViewController = async (request, response) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { userData } = value;
  const { blogSlug } = request.params;

  try {
    const existingUser = await UserModel.findOne({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "Unauthorized!" });
    }

    const currentPage = parseInt(request.query.page) || CURRENT_PAGE;
    const blogsPerPage = parseInt(request.query.perPage) || BLOGS_PER_PAGE;
    const blogsToBeSkipped = (currentPage - 1) * blogsPerPage;

    const cacheKey = `${existingUser.userName}_${blogSlug}_${currentPage}_${blogsPerPage}`;

    const cachedBlogs = await redisClient.hGet(cacheKey, "blogs");

    if (cachedBlogs) {
      return response
        .status(200)
        .json({ responseData: JSON.parse(cachedBlogs) });
    }

    const existingBlogs = await BlogModel.find({
      blogSlug: { $eq: blogSlug },
    })
      .skip(blogsToBeSkipped)
      .limit(blogsPerPage)
      .sort({ createdAt: -1 });

    if (!existingBlogs || existingBlogs.length === 0) {
      return response.status(404).json({
        responseData: "Blogs not found!",
      });
    }

    await redisClient.hSet(cacheKey, { blogs: JSON.stringify(existingBlogs) });
    await redisClient.expire(cacheKey, TWENTY_MINUTES_IN_SECONDS);

    return response.status(200).json({ responseData: existingBlogs });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
