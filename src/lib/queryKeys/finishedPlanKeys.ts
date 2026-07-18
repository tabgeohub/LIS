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
