import { API_LIMIT, WINDOWS_MS } from "../constant/constant.mjs";
import { RedisStore } from "rate-limit-redis";
import { rateLimit } from "express-rate-limit";
import { redisClient } from "../store/redis.client.store.mjs";

export const rateLimiter = rateLimit({
  windowMs: WINDOWS_MS,
  limit: API_LIMIT,
  standardHeaders: "draft-7",
  legacyHeaders: true,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});
