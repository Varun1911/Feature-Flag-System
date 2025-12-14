import { evaluateCondition } from "./conditions.js";

export const evaluateRule = (rule: any, context: Record<string, any>) => {
  // AND logic — all conditions must be true
  return rule.conditions.every((condition: any) =>
    evaluateCondition(condition, context)
  );
};
