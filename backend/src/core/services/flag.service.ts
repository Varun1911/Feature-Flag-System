import { CreateFlagSchema } from "../../api/validators/flag.validator.js"
import { FlagModel } from "../models/flag.model.js";
import { evaluateFlag } from "../evaluation/evaluateFlag.js";
import { getRedis } from "../../config/redis.js";

const FLAG_CACHE_TTL = 60; // seconds

export const createFlagService = async (data: any) => {
    //validation using zod
    const parsed = CreateFlagSchema.parse(data);

    //checking if already exists
    const exists = await FlagModel.exists({ key: parsed.key });
    if(exists){
        throw new Error(`Feature Flag "${parsed.key}" already exists`);
    }

    const createdFlag = await FlagModel.create(parsed);

    return {
        success: true,
        flag: createdFlag
    };
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
    const flag = await getFlagByKeyCached(key);

    if (!flag) {
        throw new Error(`Feature flag "${key}" not found`);
    }

    const result = evaluateFlag(flag, context, environment);

    return {
        key,
        ...result
    };    
};