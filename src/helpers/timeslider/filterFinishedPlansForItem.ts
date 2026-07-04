import type { FinishedFlightPlanType } from "Types/finished_plans";

export function filterFinishedPlansContainingItem(input: {
  plans: FinishedFlightPlanType[];
  kind: "point" | "geometry";
  itemId: number;
}): FinishedFlightPlanType[] {
  return input.plans.filter((plan) => {
    if (input.kind === "point") {
      return (plan.points_data || []).some((p) => p.id === input.itemId);
    }
    return (plan.geometries || []).some((g) => g.id === input.itemId);
  });
}

/** Uses first occurrence of the item across plans (same idea as selectedPlansPointsList). */
export function getItemDisplayTitle(input: {
  plans: FinishedFlightPlanType[];
  kind: "point" | "geometry";
  itemId: number;
}): string {
  for (const plan of input.plans) {
    if (input.kind === "point") {
      const p = plan.points_data?.find((x) => x.id === input.itemId);
      if (p) return p.omschrijving?.trim() || `Punt ${input.itemId}`;
    } else {
      const g = plan.geometries?.find((x) => x.id === input.itemId);
      if (g)
        return (
          g.geometry_omschrijving?.trim() ||
          g.geometry_type?.trim() ||
          `Geometrie ${input.itemId}`
        );
    }
  }
  return input.kind === "point" ? `Punt ${input.itemId}` : `Geometrie ${input.itemId}`;
}
