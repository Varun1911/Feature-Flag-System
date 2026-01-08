import { getRedis } from "../../config/redis.js";

export const invalidateFlagCache = async (key: string) => {
  const redis = getRedis();
  const cacheKey = `flag:${key}`;
  await redis.del(cacheKey);
};