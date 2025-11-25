import Redis from "ioredis";

let redis: Redis;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!);
    redis.on("connect", () => console.log("Redis connecting..."));
    redis.on("error", (err) => console.error("Redis connection error-", err));
    redis.on("ready", () => console.log("Redis is ready to use"));
  }
  return redis;
};
