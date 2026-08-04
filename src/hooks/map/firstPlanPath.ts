import type { PlanPathRow } from "api-hooks/finishedPlans";

export function firstPlanPath(
  raw: PlanPathRow | PlanPathRow[] | undefined
): PlanPathRow | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}
