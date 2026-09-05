import { EnrichedPointType } from "Types";

type PlanWithPoints = {
  points_data?: Array<{ id: number }>;
} | null;

export function filterPointsForPlan(
  points: EnrichedPointType[],
  plan: PlanWithPoints
) {
  const pointIds = new Set(plan?.points_data?.map((point) => point.id) ?? []);
  return points.filter((point) => pointIds.has(point.id));
}
