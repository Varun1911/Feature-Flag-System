export const evaluateCondition = (condition: any, context: Record<string, any>) => {
  const userValue = context[condition.attribute];

  switch (condition.operator) {
    case "equals":
      return userValue === condition.value;

    case "not_equals":
      return userValue !== condition.value;

    case "in":
      return Array.isArray(condition.value) && condition.value.includes(userValue);

    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(userValue);

    case "contains":
      if (typeof userValue === "string") {
        return userValue.includes(condition.value);
      }
      if (Array.isArray(userValue)) {
        return userValue.includes(condition.value);
      }
      return false;

    default:
      return false;
  }
};
