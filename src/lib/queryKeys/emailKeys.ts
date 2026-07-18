export const emailKeys = {
  all: ["emails"] as const,
  list: () => [...emailKeys.all, "list"] as const,
};
