import { FlagVariant, EvaluationResult } from "../types/flag.js";

export const getVariantValue = (
  flag: { variants: FlagVariant[] },
  variantKey?: string
): EvaluationResult => {
  if (!variantKey) {
      throw new Error("Variant key missing")
  }

  const variant = flag.variants.find(v => v.key === variantKey);

  if (!variant) {
    throw new Error(`Variant "${variantKey}" not found in flag`);
  }

  return {
    variantKey: variant.key,
    value: variant.value
  };
};
