export const constKeys = {
  all: ["consts"] as const,
  regios: () => [...constKeys.all, "regios"] as const,
  piloten: () => [...constKeys.all, "piloten"] as const,
  waarnemers: () => [...constKeys.all, "waarnemers"] as const,
  organisaties: () => [...constKeys.all, "organisaties"] as const,
  activiteiten: () => [...constKeys.all, "activiteiten"] as const,
  luchtvaartuig: () => [...constKeys.all, "luchtvaartuig"] as const,
};
