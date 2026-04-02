import type { FinishedFlightPlanType } from "Types/finished_plans";

/** IDs of points and geometries attached to the given finished flight plans (timeslider list). */
export function getPointAndGeometryIdsFromPlans(plans: FinishedFlightPlanType[]) {
  const pointIds = new Set<number>();
  const geometryIds = new Set<number>();
  for (const plan of plans) {
    for (const p of plan.points_data || []) pointIds.add(p.id);
    for (const g of plan.geometries || []) geometryIds.add(g.id);
  }
  return { pointIds, geometryIds };
}
