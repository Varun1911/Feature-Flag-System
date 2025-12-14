import crypto from "crypto";

/**
 * Returns a number between 0 and 99 (inclusive)
 */
export const getUserBucket = (
  flagKey: string,
  userId: string
): number => {
  const hash = crypto
    .createHash("sha1")
    .update(`${flagKey}:${userId}`)
    .digest("hex");

  // Take first 8 hex chars → convert to int → mod 100
  return parseInt(hash.substring(0, 8), 16) % 100;
};
