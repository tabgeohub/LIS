import { FinishedFlightPlanType } from "Types/finished_plans";

export function filterSelectedReportData(input: {
  selectedPlan: FinishedFlightPlanType;
  selectedPoints: number[];
  selectedGeometries: number[];
}) {
  const selectedPointsData = input.selectedPlan.points_data.filter((point) =>
    input.selectedPoints.includes(point.id)
  );
  const selectedGeometriesData = (
    input.selectedPlan.geometries || []
  ).filter((geometry) => input.selectedGeometries.includes(geometry.id));
  return { selectedPointsData, selectedGeometriesData };
}
