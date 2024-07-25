import { redisClient } from "../store/redis.client.store.mjs";

/**
 * @description Function to retrieve the required keys from redis store.
 * @param {string} pattern Pattern to match and or filter the keys for.
 * @link Refer https://redis.io/docs/latest/commands/scan/ for more documentation.
 * @returns Array of keys.
 */
export const redisKeysRetrievalUtility = async (pattern) => {
  let cursor = "0";
  const keys = [];

  do {
    /**
     * Pattern might not work during most iterations, if very few keys match the pattern, you might not see any matching keys in those iterations.
     *
     * If that is the case than use the JavaScript .filter method and update the keys array.
     */

    const result = await redisClient.scan(cursor, "MATCH", pattern);
    cursor = `${result.cursor}`;

    keys.push(
      // TODO: Use ...result.keys if you are assured that the required pattern used for matching the keys are not few.
      ...result.keys.filter((key) => key.substr(0, 3) === pattern.substr(0, 3))
    );
  } while (cursor !== "0");
  return keys;
};
