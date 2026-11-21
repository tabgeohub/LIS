export const waarnemerKeys = {
  all: ["waarnemers"] as const,
  list: () => [...waarnemerKeys.all, "list"] as const,
};
