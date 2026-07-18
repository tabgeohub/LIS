export const pointKeys = {
  all: ["points"] as const,
  searched: (search: string) =>
    [...pointKeys.all, "searched", search] as const,
  duplicateOmschrijving: (omschrijving: string) =>
    [...pointKeys.all, "duplicate", omschrijving] as const,
};
