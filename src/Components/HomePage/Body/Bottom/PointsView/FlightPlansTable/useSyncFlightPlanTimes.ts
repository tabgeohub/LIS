/* eslint-disable react-hooks/exhaustive-deps */
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { useEffect } from "react";
import { FlightPlanType } from "Types";
import type { FlightPathMetrics } from "hooks/flightPathMetrics";

function hasCompleteFlightMetrics(metrics: FlightPathMetrics): boolean {
  return Boolean(
    metrics.beginTime &&
      metrics.endTime &&
      metrics.durationSeconds &&
      metrics.totalDistance
  );
}

function withUpdatedPlanTimes(
  flightPlans: FlightPlanType[],
  planId: number,
  metrics: FlightPathMetrics
): FlightPlanType[] {
  return flightPlans.map((fp) =>
    fp.id === planId
      ? {
          ...fp,
          beginTime: metrics.beginTime!,
          endTime: metrics.endTime!,
          durationSeconds: metrics.durationSeconds!,
          totalDistance: metrics.totalDistance!,
        }
      : fp
  );
}

export function useSyncFlightPlanTimes(plan: FlightPlanType) {
  const { flightPlans, setFlightPlans } = useOpenTable();
  const metrics = useGetFlightTimesDistance({ flightPlan: plan });

  useEffect(() => {
    if (!hasCompleteFlightMetrics(metrics)) return;
    setFlightPlans(withUpdatedPlanTimes(flightPlans, plan.id, metrics));
  }, [
    metrics.beginTime,
    metrics.endTime,
    metrics.durationSeconds,
    metrics.totalDistance,
  ]);
}
