import Graphic from "@arcgis/core/Graphic";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { collectPointsForCenterAndZoom } from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import {
  createPlanBoundingBoxGraphic,
  PlanBoundingBoxSymbolOptions,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";

export {
  FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS,
  addFinishedPlanGeometryCentroidMarkers,
} from "./finishedPlanCentroidMarkers";

export function getFinishedPlanBoundingPoints(plan: FinishedFlightPlanType) {
  return collectPointsForCenterAndZoom(plan);
}

export function createFinishedPlanBoundingBoxGraphic(
  plan: FinishedFlightPlanType,
  symbolOptions: PlanBoundingBoxSymbolOptions
): Graphic | null {
  return createPlanBoundingBoxGraphic(getFinishedPlanBoundingPoints(plan), {
    symbolOptions,
  });
}
