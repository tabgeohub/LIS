export const templateFlightKeys = {
  all: ["templateFlight"] as const,
  list: (regioId: string | number) =>
    [...templateFlightKeys.all, "list", String(regioId)] as const,
};
