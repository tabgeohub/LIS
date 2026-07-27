import type { FinishedFlightPlanType } from "Types/finished_plans";

function addIdsFromItems(input: {
  items: { id: number }[] | null | undefined;
  target: Set<number>;
}) {
  for (const item of input.items ?? []) input.target.add(item.id);
}

function addPlanPointAndGeometryIds(input: {
  plan: FinishedFlightPlanType;
  pointIds: Set<number>;
  geometryIds: Set<number>;
}) {
  addIdsFromItems({ items: input.plan.points_data, target: input.pointIds });
  addIdsFromItems({ items: input.plan.geometries, target: input.geometryIds });
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
