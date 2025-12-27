import { evaluateRule } from "./evaluateRule.js";
import { evaluateRollout } from "./evaluateRollout.js";
import { getVariantValue } from "./getVariantValue.js";
import { EvaluationResult } from "../types/flag.js";

export const evaluateFlag = (
  flag: any,
  context: Record<string, any>,
  environment: "dev" | "prod" = "prod"
): EvaluationResult => {
  const env = flag.environments?.[environment];

  // 1. Environment missing or disabled
  if (!env || !env.isEnabled) {
    return getVariantValue(flag, env?.defaultVariant);
  }

  const userId = context.userId;

  // 2. OR logic across rules
  for (const rule of env.rules || []) {
    const matches = evaluateRule(rule, context);
    if (!matches) continue;

    // 3. Rule matched — apply rollout if possible
    if (rule.rollout?.length && userId) {
      const variantKey = evaluateRollout(
        rule.rollout,
        flag.key,
        userId
      );

      if (variantKey) {
        return getVariantValue(flag, variantKey);
      }
    }

    // 4. Rule matched but no rollout or no userId
    return getVariantValue(flag, env.defaultVariant);
  }

  // 5. No rules matched
  return getVariantValue(flag, env.defaultVariant);
};
