import { geometryPathFromPoints } from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { createPlanGeometryHighlightGraphic } from "./timesliderGeometryHighlightFactory";

export function addPlanGeometryHighlights(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType
) {
  for (const g of plan.geometries || []) {
    const path = geometryPathFromPoints(g.points);
    if (path.length < 2) continue;
    layer.add(createPlanGeometryHighlightGraphic({ plan, geometry: g, path }));
  }
}
