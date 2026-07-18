import { FinishedFlightPlanType } from "Types/finished_plans";
import { findNearestPathPoint, parsePlanPath } from "./pathPlanUtils";

function buildSelectedPathPoint(
  nearest: NonNullable<ReturnType<typeof findNearestPathPoint>>,
  plan: FinishedFlightPlanType
) {
  return {
    longitude: nearest.longitude,
    latitude: nearest.latitude,
    altitude: nearest.altitude ?? 0,
    speed: nearest.speed ?? 0,
    rotationAngle: nearest.rotationAngle ?? 0,
    planId: String(plan.id ?? ""),
    vluchtnummer: plan.vluchtnummer ?? "",
    nearest,
  };
}

export function resolveSelectedPathPoint(input: {
  plan: FinishedFlightPlanType;
  planPath: ReturnType<typeof parsePlanPath>;
  latitude: number;
  longitude: number;
  maxDistanceM: number;
}) {
  const nearest = findNearestPathPoint(input);
  if (!nearest) return null;
  return buildSelectedPathPoint(nearest, input.plan);
}
