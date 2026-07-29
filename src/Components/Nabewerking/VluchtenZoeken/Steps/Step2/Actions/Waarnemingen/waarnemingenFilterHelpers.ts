import { sortPointsByImageCount } from "Components/HomePage/helpers/points/sortPointsByImageCount";
import type { FinishedFlightPlanType } from "Types/finished_plans";

export function filterWaarnemingenPoints(input: {
  pointsData: FinishedFlightPlanType["points_data"] | undefined;
  value: string;
}) {
  if (!input.pointsData) return [];
  return sortPointsByImageCount(
    input.pointsData.filter((point) =>
      point.omschrijving.toLowerCase().includes(input.value.toLowerCase())
    )
  );
}

export function filterWaarnemingenGeometries(input: {
  geometries: FinishedFlightPlanType["geometries"] | undefined;
  value: string;
}) {
  if (!input.geometries) return [];
  const searchTerm = input.value.toLowerCase();
  return input.geometries.filter((geometry) => {
    const omschrijving = geometry.geometry_omschrijving?.toLowerCase() || "";
    return omschrijving.includes(searchTerm);
  });
}
