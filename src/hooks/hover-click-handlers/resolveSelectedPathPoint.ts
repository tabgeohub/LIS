import { FinishedFlightPlanType } from "Types/finished_plans";
import { findNearestPathPoint, parsePlanPath } from "./pathPlanUtils";

function coalesce<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

function stringifyNullableId(id: number | null | undefined): string {
  return id == null ? "" : String(id);
}

function buildSelectedPathPoint(
  nearest: NonNullable<ReturnType<typeof findNearestPathPoint>>,
  plan: FinishedFlightPlanType
) {
  return {
    longitude: nearest.longitude,
    latitude: nearest.latitude,
    altitude: coalesce(nearest.altitude, 0),
    speed: coalesce(nearest.speed, 0),
    rotationAngle: coalesce(nearest.rotationAngle, 0),
    planId: stringifyNullableId(plan.id),
    vluchtnummer: coalesce(plan.vluchtnummer, ""),
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
