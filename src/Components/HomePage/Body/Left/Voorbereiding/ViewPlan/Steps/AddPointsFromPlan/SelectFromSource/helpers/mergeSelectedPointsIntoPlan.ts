import { EnrichedPointType, FlightPlanType } from "Types";
import { SelectFromSourceItemPoint } from "./mapSourceItems";
import { createYellowPointGraphic } from "./createYellowPointGraphic";
import Graphic from "@arcgis/core/Graphic";

export function mergeSelectedPointsIntoPlan(input: {
  selectedPlan: FlightPlanType;
  checkedPoints: SelectFromSourceItemPoint[];
  dbPoints: EnrichedPointType[];
  filteredPlans: FlightPlanType[];
}) {
  const uniqueIds = Array.from(
    new Set([
      ...input.selectedPlan.points.map((p) => p.id),
      ...input.checkedPoints.map((p) => p.id),
    ])
  );
  const updatedPoints = input.dbPoints.filter((p) => uniqueIds.includes(p.id));
  const updatedPlan: FlightPlanType = {
    ...input.selectedPlan,
    points: updatedPoints,
    pointsObjects: updatedPoints,
  };
  const updatedFilteredPlans = input.filteredPlans.map((p) =>
    p.id === input.selectedPlan.id
      ? { ...p, points: updatedPoints, pointsObjects: updatedPoints }
      : p
  );
  return { uniqueIds, updatedPoints, updatedPlan, updatedFilteredPlans };
}

export function addYellowGraphicsForPoints(
  checkedPoints: SelectFromSourceItemPoint[],
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined
) {
  checkedPoints
    .map(createYellowPointGraphic)
    .filter((g): g is Graphic => g !== null)
    .forEach((graphic) => yellowGraphicsLayer?.add(graphic));
}
