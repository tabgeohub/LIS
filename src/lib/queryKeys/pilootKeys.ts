export const pilootKeys = {
  all: ["piloten"] as const,
  list: () => [...pilootKeys.all, "list"] as const,
};
