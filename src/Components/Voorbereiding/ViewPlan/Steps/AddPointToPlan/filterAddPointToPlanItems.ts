import type { EnrichedPointType, FlightPlanType } from "Types";
import type { Geometry } from "hooks/features";

export function filterPointsNotInPlan(
  dbPoints: EnrichedPointType[],
  selectedPlan: FlightPlanType | null | undefined
) {
  return dbPoints.filter(
    (dbPoint) => !selectedPlan?.points.some((p) => p.id === dbPoint.id)
  );
}

export function filterGeometriesNotInPlan(
  dbGeometries: Geometry[],
  selectedPlan: FlightPlanType | null | undefined
) {
  return dbGeometries.filter(
    (geometry) => !selectedPlan?.geometries?.some((g) => g.id === geometry.id)
  );
}
