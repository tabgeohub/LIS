import { FinishedFlightPlanType } from "Types/finished_plans";
import { findNearestPathPoint, parsePlanPath } from "./pathPlanUtils";

export function resolveSelectedPathPoint(input: {
  plan: FinishedFlightPlanType;
  planPath: ReturnType<typeof parsePlanPath>;
  latitude: number;
  longitude: number;
  maxDistanceM: number;
}) {
  const nearest = findNearestPathPoint(input);
  if (!nearest) return null;
  return {
    longitude: nearest.longitude,
    latitude: nearest.latitude,
    altitude: nearest.altitude ?? 0,
    speed: nearest.speed ?? 0,
    rotationAngle: nearest.rotationAngle ?? 0,
    planId: String(input.plan.id ?? ""),
    vluchtnummer: input.plan.vluchtnummer ?? "",
    nearest,
  };
}
