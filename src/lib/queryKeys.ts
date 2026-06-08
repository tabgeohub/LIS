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

export const templateFlightKeys = {
  all: ["templateFlight"] as const,
  list: (regioId: string | number) =>
    [...templateFlightKeys.all, "list", String(regioId)] as const,
};

export const pointKeys = {
  all: ["points"] as const,
  searched: (search: string) =>
    [...pointKeys.all, "searched", search] as const,
  duplicateOmschrijving: (omschrijving: string) =>
    [...pointKeys.all, "duplicate", omschrijving] as const,
};

export const finishedPlanKeys = {
  all: ["finished_plans"] as const,
  partialList: (regioId: string | number) =>
    [...finishedPlanKeys.all, "partial", String(regioId)] as const,
  single: (planId: number) =>
    [...finishedPlanKeys.all, "single", planId] as const,
  planPath: (planId: number) =>
    [...finishedPlanKeys.all, "planPath", planId] as const,
  attachments: (planId: number, pointId: number) =>
    [...finishedPlanKeys.all, "attachments", planId, pointId] as const,
};

export const constKeys = {
  all: ["consts"] as const,
  regios: () => [...constKeys.all, "regios"] as const,
  piloten: () => [...constKeys.all, "piloten"] as const,
  waarnemers: () => [...constKeys.all, "waarnemers"] as const,
  organisaties: () => [...constKeys.all, "organisaties"] as const,
  activiteiten: () => [...constKeys.all, "activiteiten"] as const,
  luchtvaartuig: () => [...constKeys.all, "luchtvaartuig"] as const,
};

export const emailKeys = {
  all: ["emails"] as const,
  list: () => [...emailKeys.all, "list"] as const,
};

export const geometryKeys = {
  all: ["geometries"] as const,
};
