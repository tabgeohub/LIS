import type { FinishedFlightPlanType } from "Types/finished_plans";

export function filterFinishedPlansContainingItem(
  plans: FinishedFlightPlanType[],
  kind: "point" | "geometry",
  itemId: number
): FinishedFlightPlanType[] {
  return plans.filter((plan) => {
    if (kind === "point") {
      return (plan.points_data || []).some((p) => p.id === itemId);
    }
    return (plan.geometries || []).some((g) => g.id === itemId);
  });
}

/** Uses first occurrence of the item across plans (same idea as selectedPlansPointsList). */
export function getItemDisplayTitle(
  plans: FinishedFlightPlanType[],
  kind: "point" | "geometry",
  itemId: number
): string {
  for (const plan of plans) {
    if (kind === "point") {
      const p = plan.points_data?.find((x) => x.id === itemId);
      if (p) return p.omschrijving?.trim() || `Punt ${itemId}`;
    } else {
      const g = plan.geometries?.find((x) => x.id === itemId);
      if (g)
        return (
          g.geometry_omschrijving?.trim() ||
          g.geometry_type?.trim() ||
          `Geometrie ${itemId}`
        );
    }
  }
  return kind === "point" ? `Punt ${itemId}` : `Geometrie ${itemId}`;
}
