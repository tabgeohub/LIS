import type { FinishedFlightPlanType } from "Types/finished_plans";

function addPlanPointAndGeometryIds(input: {
  plan: FinishedFlightPlanType;
  pointIds: Set<number>;
  geometryIds: Set<number>;
}) {
  for (const p of input.plan.points_data ?? []) input.pointIds.add(p.id);
  for (const g of input.plan.geometries ?? []) input.geometryIds.add(g.id);
}

/** IDs of points and geometries attached to the given finished flight plans (timeslider list). */
export function getPointAndGeometryIdsFromPlans(plans: FinishedFlightPlanType[]) {
  const pointIds = new Set<number>();
  const geometryIds = new Set<number>();
  for (const plan of plans) {
    addPlanPointAndGeometryIds({ plan, pointIds, geometryIds });
  }
  return { pointIds, geometryIds };
}
