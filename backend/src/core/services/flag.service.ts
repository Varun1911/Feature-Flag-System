import { FlagModel } from "../models/flag.model.js";
import { evaluateFlag } from "../evaluation/evaluateFlag.js";
import { getRedis } from "../../config/redis.js";
import { invalidateFlagCache } from "./flag.cache.js";
import {
  getCachedEvaluation,
  setCachedEvaluation
} from "./flag.eval.cache.js";
import { AuditLogModel } from "../models/auditlog.model.js";
import type { UpdateFlagInput } from "../types/flag.js";
import { FlagVersionModel } from "../models/flagVersion.model.js";


const FLAG_CACHE_TTL = 60; // seconds

export const createFlagService = async (data: any, user: string) => {
  const exists = await FlagModel.exists({ key: data.key });
  if (exists) {
    throw new Error(`Feature Flag ${data.key} already exists`);
  }

  const created = await FlagModel.create(data);

  await FlagVersionModel.create({
    flagKey: data.key,
    version: 1,
    data: created,
    createdBy: user
  });

  await AuditLogModel.create({
    flagKey: data.key,
    action: "CREATE",
    after: created,
    changedBy: user
  });

  return { success: true, flag: created };
};


export const updateFlagService = async (
  key: string,
  update: Record<string, any>,
  user: string
) => {
  // 1. Get current flag
  const before = await FlagModel.findOne({ key }).lean();
  if (!before) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  // 2. Update flag
  const after = await FlagModel.findOneAndUpdate(
    { key },
    update,
    { new: true }
  ).lean();

  if (!after) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  // 3. Invalidate Redis cache
  await invalidateFlagCache(key);

  // 4. Create audit log
  await AuditLogModel.create({
    flagKey: key,
    action: "UPDATE",
    before,
    after,
    changedBy: user
  });

  // 5. Create new version
  const latest = await FlagVersionModel
    .findOne({ flagKey: key })
    .sort({ version: -1 });

  const nextVersion = latest ? latest.version + 1 : 1;

  await FlagVersionModel.create({
    flagKey: key,
    version: nextVersion,
    data: after,
    createdBy: user
  });

  return {
    success: true,
    flag: after
  };
};

export const deleteFlagService = async (key: string, user: string) => {
  const before = await FlagModel.findOneAndDelete({ key }).lean();

  if (!before) {
    throw new Error(`Feature flag "${key}" not found`);
  }

  await invalidateFlagCache(key);

  await AuditLogModel.create({
    flagKey: key,
    action: "DELETE",
    before,
    changedBy: user
  });

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

export const rollbackFlagService = async (
  key: string,
  version: number,
  user: string
) => {
  const snapshot = await FlagVersionModel.findOne({
    flagKey: key,
    version
  });

  if (!snapshot) {
    throw new Error("Version not found");
  }

  const before = await FlagModel.findOne({ key }).lean();

  const restored = await FlagModel.findOneAndUpdate(
    { key },
    snapshot.data,
    { new: true }
  ).lean();

  await invalidateFlagCache(key);

  await AuditLogModel.create({
    flagKey: key,
    action: "ROLLBACK",
    before,
    after: restored,
    changedBy: user
  });

  return restored;
};
