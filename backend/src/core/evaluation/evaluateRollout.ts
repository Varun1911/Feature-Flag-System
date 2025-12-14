import { getUserBucket } from "./hashPercentage.js";

/**
 * Chooses a variant based on rollout percentages
 */
export const evaluateRollout = (
  rollout: { variant: string; percentage: number }[],
  flagKey: string,
  userId: string
): string | null => {
  const bucket = getUserBucket(flagKey, userId);

  let cumulative = 0;

  for (const entry of rollout) {
    cumulative += entry.percentage;

    if (bucket < cumulative) {
      return entry.variant;
    }
  }

  return null;
};
