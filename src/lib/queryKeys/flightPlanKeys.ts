export const flightPlanKeys = {
  all: ["flightPlans"] as const,
  lists: () => [...flightPlanKeys.all, "list"] as const,
  list: (regioId: string | number) =>
    [...flightPlanKeys.lists(), String(regioId)] as const,
  unPrepared: (regioId: string | number) =>
    [...flightPlanKeys.all, "unPrepared", String(regioId)] as const,
  preprepared: (regioId: string | number) =>
    [...flightPlanKeys.all, "preprepared", String(regioId)] as const,
  fullPrepared: (regioId: string | number) =>
    [...flightPlanKeys.all, "fullPrepared", String(regioId)] as const,
  vluchtnummer: (vluchtnummer: string) =>
    [...flightPlanKeys.all, "vluchtnummer", vluchtnummer] as const,
  searched: (search: string) =>
    [...flightPlanKeys.all, "searched", search] as const,
  byPoint: (pointId: number) =>
    [...flightPlanKeys.all, "point", pointId] as const,
};
