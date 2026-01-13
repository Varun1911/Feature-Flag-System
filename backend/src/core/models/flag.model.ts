import mongoose from "mongoose";

// Variant Schema
const VariantSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

// Condition Schema
const ConditionSchema = new mongoose.Schema({
  attribute: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

// Rollout Schema
const RolloutSchema = new mongoose.Schema({
  variant: { type: String, required: true },
  percentage: { type: Number, required: true }
});

// Rule Schema (conditions ANDed → rollout applied)
const RuleSchema = new mongoose.Schema({
  conditions: [ConditionSchema], 
  rollout: [RolloutSchema]
});

// Environment Schema (rules ORed)
const EnvironmentConfigSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  defaultVariant: { type: String, required: true },
  rules: [RuleSchema]
});

// Full Flag Schema
const FlagSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    description: { type: String },
    variants: [VariantSchema],

    environments: {
      dev: EnvironmentConfigSchema,
      prod: EnvironmentConfigSchema
    },

    tags: [String],
  },
  { timestamps: true }
);

export const FlagModel = mongoose.model("FeatureFlag", FlagSchema);
