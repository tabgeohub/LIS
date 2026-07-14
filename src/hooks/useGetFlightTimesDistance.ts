import { useFinishedPlanPath } from "api-hooks/finishedPlans";
import { useMemo } from "react";
import { calculateFlightPathMetrics } from "./flightPathMetrics";
import type { PlanPathRow } from "api-hooks/finishedPlans";

function firstPlanPath(raw: PlanPathRow | PlanPathRow[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

export function useGetFlightTimesDistance(flightPlan: { id?: number }) {
  const { data } = useFinishedPlanPath(flightPlan?.id);
  const row = firstPlanPath(data);
  return useMemo(() => calculateFlightPathMetrics(row), [row]);
}
