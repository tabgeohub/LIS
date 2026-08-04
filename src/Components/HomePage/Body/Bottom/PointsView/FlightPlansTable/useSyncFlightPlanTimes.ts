/* eslint-disable react-hooks/exhaustive-deps */
import { useOpenTable } from "hooks/zustand/ui";
import { useGetFlightTimesDistance } from "hooks/map/useGetFlightTimesDistance";
import { useEffect } from "react";
import { FlightPlanType } from "Types";
import type { FlightPathMetrics } from "hooks/map/flightPathMetrics";

function hasCompleteFlightMetrics(metrics: FlightPathMetrics): boolean {
  return Boolean(
    metrics.beginTime &&
      metrics.endTime &&
      metrics.durationSeconds &&
      metrics.totalDistance
  );
}

function withUpdatedPlanTimes(input: {
  flightPlans: FlightPlanType[];
  planId: number;
  metrics: FlightPathMetrics;
}): FlightPlanType[] {
  return input.flightPlans.map((fp) =>
    fp.id === input.planId
      ? {
          ...fp,
          beginTime: input.metrics.beginTime!,
          endTime: input.metrics.endTime!,
          durationSeconds: input.metrics.durationSeconds!,
          totalDistance: input.metrics.totalDistance!,
        }
      : fp
  );
}

export function useSyncFlightPlanTimes(plan: FlightPlanType) {
  const { flightPlans, setFlightPlans } = useOpenTable();
  const metrics = useGetFlightTimesDistance({ flightPlan: plan });

  useEffect(() => {
    if (!hasCompleteFlightMetrics(metrics)) return;
    setFlightPlans(
      withUpdatedPlanTimes({ flightPlans, planId: plan.id, metrics })
    );
  }, [
    metrics.beginTime,
    metrics.endTime,
    metrics.durationSeconds,
    metrics.totalDistance,
  ]);
}
