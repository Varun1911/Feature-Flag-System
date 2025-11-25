import Redis from "ioredis";

let redis: Redis;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || "");
    redis.on("connect", () => console.log("Redis connected"));
  }
  return redis;
};
