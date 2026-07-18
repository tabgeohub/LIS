import { sortPointsByImageCount } from "@helpers/points/sortPointsByImageCount";
import type { FinishedFlightPlanType } from "Types/finished_plans";

export function filterWaarnemingenPoints(
  pointsData: FinishedFlightPlanType["points_data"] | undefined,
  value: string
) {
  if (!pointsData) return [];
  return sortPointsByImageCount(
    pointsData.filter((point) =>
      point.omschrijving.toLowerCase().includes(value.toLowerCase())
    )
  );
}

export function filterWaarnemingenGeometries(
  geometries: FinishedFlightPlanType["geometries"] | undefined,
  value: string
) {
  if (!geometries) return [];
  const searchTerm = value.toLowerCase();
  return geometries.filter((geometry) => {
    const omschrijving = geometry.geometry_omschrijving?.toLowerCase() || "";
    return omschrijving.includes(searchTerm);
  });
}
