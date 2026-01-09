import { z } from "zod";

/* ---------- Small reusable schemas ---------- */

const RolloutPatchSchema = z.object({
  variant: z.string(),
  percentage: z.number().min(0).max(100)
}).partial();


const ConditionPatchSchema = z.object({
  attribute: z.string(),
  operator: z.enum([
    "equals",
    "not_equals",
    "in",
    "not_in",
    "contains"
  ]),
  value: z.any()
}).partial();


const RulePatchSchema = z.object({
  conditions: z.array(ConditionPatchSchema).optional(),
  rollout: z.array(RolloutPatchSchema).optional()
});

const EnvironmentPatchSchema = z.object({
  isEnabled: z.boolean().optional(),
  defaultVariant: z.string().optional(),
  rules: z.array(RulePatchSchema).optional()
});

/* ---------- Final PATCH schema ---------- */

export const PatchFlagSchema = z.object({
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),

  environments: z.object({
    dev: EnvironmentPatchSchema.optional(),
    prod: EnvironmentPatchSchema.optional()
  }).optional()
});
