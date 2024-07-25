import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import { payloadValidator } from "../validator/payload.validator.mjs";
import { redisClient } from "../store/redis.client.store.mjs";
import { redisKeysRetrievalUtility } from "../utility/redis.keys.retrieval.utility.mjs";

export const redisBlogCacheController = async (request, response) => {
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

    const redisUserKeys = await redisKeysRetrievalUtility(
      `${existingUser.userName}*`
    );

    if (!redisUserKeys || redisUserKeys.length === 0) {
      return response.status(404).json({
        responseData: `"Redis user keys (redisUserKeys)" for user ${existingUser.userName} is not found. No keys deleted!`,
      });
    }

    for (const key of redisUserKeys) {
      await redisClient.del(key);
    }

    return response.status(200).json({
      responseData: `Redis Cache for user ${existingUser.userName} invalidated successfully!`,
    });
  } catch (error) {
    catchErrorUtility(error, response);
  }
};
