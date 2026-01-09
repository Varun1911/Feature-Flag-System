import { FlagModel } from "../models/flag.model.js";
import { evaluateFlag } from "../evaluation/evaluateFlag.js";
import { getRedis } from "../../config/redis.js";
import { invalidateFlagCache } from "./flag.cache.js";
import {
  getCachedEvaluation,
  setCachedEvaluation
} from "./flag.eval.cache.js";

const FLAG_CACHE_TTL = 60; // seconds

export const createFlagService = async (data: any) => {

    //checking if already exists
    const exists = await FlagModel.exists({ key: data.key });
    if(exists){
        throw new Error(`Feature Flag "${data.key}" already exists`);
    }

    const createdFlag = await FlagModel.create(data);

    return {
        success: true,
        flag: createdFlag
    };
};

export const updateFlagService = async (
  key: string,
  update: Record<string, any>
) => {
  const updated = await FlagModel.findOneAndUpdate(
    { key },
    update,
    { new: true }
  );

  if (!updated) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  await invalidateFlagCache(key);

  return {
    success: true,
    flag: updated
  };
};

export const deleteFlagService = async (key: string) => {
  const deleted = await FlagModel.findOneAndDelete({ key });

  if (!deleted) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  await invalidateFlagCache(key);

  return { success: true };
};


export const getAllFlagsService = async () => {
    const flags = await FlagModel.find({});
    return {
        success: true,
        count: flags.length,
        flags
    };
};


export const getFlagByKeyService = async (key: string) => {
    const flag = await FlagModel.findOne({ key });

    // controller handles the null case
    return flag;
};


const getFlagByKeyCached = async (key: string) => {
  const redis = getRedis();
  const cacheKey = `flag:${key}`;

  // 1. Try cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Fetch from DB
  const flag = await FlagModel.findOne({ key }).lean();
  if (!flag) return null;

  // 3. Store in Redis
  await redis.setex(
    cacheKey,
    FLAG_CACHE_TTL,
    JSON.stringify(flag)
  );

  return flag;
};


export const evaluateFlagService = async (
  key: string,
  context: Record<string, any>,
  environment: "dev" | "prod" = "prod"
) => {
  const userId = context.userId;

  // Only cache if userId exists
  if (userId) {
    const cacheKey = `eval:${key}:${environment}:${userId}`;

    const cached = await getCachedEvaluation(cacheKey);
    if (cached) {
      return { key, ...cached };
    }

    const flag = await getFlagByKeyCached(key);
    if (!flag) {
      throw new Error(`Feature flag "${key}" not found`);
    }

    const result = evaluateFlag(flag, context, environment);

    await setCachedEvaluation(cacheKey, result);

    return { key, ...result };
  }

  // No userId → no evaluation cache
  const flag = await getFlagByKeyCached(key);
  if (!flag) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  const result = evaluateFlag(flag, context, environment);
  return { key, ...result };
};