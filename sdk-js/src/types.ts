export type UserContext = {
  userId: string;
  [key: string]: any;
};

export type EvaluationResponse = {
  key: string;
  variantKey: string;
  value: any;
};
