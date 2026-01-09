import { getRedis } from "../../config/redis.js";
import { EvaluationResult } from "../types/flag.js";

const EVAL_CACHE_TTL = 15;

export const getCachedEvaluation = async (
  cacheKey: string
): Promise<EvaluationResult | null> => {
  const redis = getRedis();
  const cached = await redis.get(cacheKey);
  return cached ? JSON.parse(cached) : null;
};

export const setCachedEvaluation = async (
  cacheKey: string,
  result: EvaluationResult
) => {
  const redis = getRedis();
  await redis.setex(
    cacheKey,
    EVAL_CACHE_TTL,
    JSON.stringify(result)
  );
};
