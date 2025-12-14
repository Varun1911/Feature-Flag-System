import { FlagVariant } from "../types/flag.js";

export const getVariantValue = (
  flag: { variants: FlagVariant[] },
  variantKey?: string
) => {
  if (!variantKey) return null;

  const variant = flag.variants.find(v => v.key === variantKey);

  if (!variant) {
    throw new Error(`Variant "${variantKey}" not found in flag`);
  }

  return variant.value;
};
