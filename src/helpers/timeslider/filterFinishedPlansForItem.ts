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

function pointTitle(
  plan: FinishedFlightPlanType,
  itemId: number
): string | null {
  const point = plan.points_data?.find((x) => x.id === itemId);
  if (!point) return null;
  return point.omschrijving?.trim() || `Punt ${itemId}`;
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function geometryTitle(
  plan: FinishedFlightPlanType,
  itemId: number
): string | null {
  const geometry = plan.geometries?.find((x) => x.id === itemId);
  if (!geometry) return null;
  return (
    firstNonEmpty(geometry.geometry_omschrijving, geometry.geometry_type) ||
    `Geometrie ${itemId}`
  );
}

function fallbackItemTitle(kind: "point" | "geometry", itemId: number): string {
  return kind === "point" ? `Punt ${itemId}` : `Geometrie ${itemId}`;
}

/** Uses first occurrence of the item across plans (same idea as selectedPlansPointsList). */
export function getItemDisplayTitle(input: {
  plans: FinishedFlightPlanType[];
  kind: "point" | "geometry";
  itemId: number;
}): string {
  for (const plan of input.plans) {
    const title =
      input.kind === "point"
        ? pointTitle(plan, input.itemId)
        : geometryTitle(plan, input.itemId);
    if (title) return title;
  }
  return fallbackItemTitle(input.kind, input.itemId);
}
