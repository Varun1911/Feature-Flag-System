import { z } from "zod";

const ConditionSchema = z.object({
    attribute: z.string(),
    operator: z.enum(["equals", "not_equals", "in", "not_in", "contains"]),
    value: z.any()
});

const RolloutSchema = z.object({
    variant: z.string(),
    percentage: z.number().min(0).max(100)
});


const RuleSchema = z.object({
    conditions: z.array(ConditionSchema),
    rollout: z.array(RolloutSchema)
});


const EnvironmentConfigSchema  = z.object({
    isEnabled: z.boolean(),
    defaultVariant: z.string(),
    rules: z.array(RuleSchema)
});


const VariantSchema = z.object({
    key: z.string(),
    value: z.any()
});


export const CreateFlagSchema = z.object({
    key: z.string(),
    description: z.string().optional(),
    variants: z.array(VariantSchema),
    environments: z.object({
        dev: EnvironmentConfigSchema ,
        prod: EnvironmentConfigSchema 
    }),
    tags: z.array(z.string()).optional(),
    createdBy: z.string().optional()
})
