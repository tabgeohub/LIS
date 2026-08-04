import { useFinishedPlanPath } from "api-hooks/finishedPlans";
import { useMemo } from "react";
import { calculateFlightPathMetrics } from "./flightPathMetrics";
import { firstPlanPath } from "./firstPlanPath";

export function useGetFlightTimesDistance(options: {
  flightPlan: { id?: number } | null | undefined;
}) {
  const { data } = useFinishedPlanPath(options.flightPlan?.id);
  const row = firstPlanPath(data);
  return useMemo(() => calculateFlightPathMetrics(row), [row]);
}
