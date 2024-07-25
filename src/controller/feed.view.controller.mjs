import { BlogModel, UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";
import { redisClient } from "../store/redis.client.store.mjs";

export const feedViewController = async (request, response) => {
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

    const currentPage = parseInt(request.query.page) || 1;
    const blogsPerPage = parseInt(request.query.perPage) || 50;
    const blogsToBeSkipped = (currentPage - 1) * blogsPerPage;

    const cacheKey = `${existingUser.userName}_${currentPage}_feeds_${blogsPerPage}`;

    const cachedBlogs = await redisClient.hGet(cacheKey, "blogs");

    if (cachedBlogs) {
      return response
        .status(200)
        .json({ responseData: JSON.parse(cachedBlogs) });
    }

    const existingBlogs = await BlogModel.find({})
      .skip(blogsToBeSkipped)
      .limit(blogsPerPage)
      .sort({ createdAt: -1 });

    if (!existingBlogs || existingBlogs.length === 0) {
      return response.status(404).json({
        responseData: "OOPS! Looks like there are no feeds to show!",
      });
    }

    await redisClient.hSet(cacheKey, { blogs: JSON.stringify(existingBlogs) });
    await redisClient.expire(cacheKey, 1200);

    return response.status(200).json({ responseData: existingBlogs });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
