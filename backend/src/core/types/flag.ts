export type FlagCondition = {
  attribute: string;   
  operator: "equals" | "not_equals" | "in" | "not_in" | "contains";
  value: any;
};

export type RolloutRule = {
  variant: string;
  percentage: number; // 0–100
};

export type FlagRule = {
  conditions: FlagCondition[];  // AND inside rule
  rollout: RolloutRule[];       // applied if rule matches
};

export type EnvironmentConfig = {
  isEnabled: boolean;
  defaultVariant: string;
  rules: FlagRule[];            // OR across rules
};

export type FlagVariant = {
  key: string;
  value: any;
};


export type EvaluationResult = {
  variantKey: string;
  value: any;
};


export type FlagKey = string;

export type UpdateFlagInput = Record<string, any>; 
