import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { FinishedFlightPlanType } from "Types/finished_plans";
import {
  collectPointsForCenterAndZoom,
  geometryCentroid,
} from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import {
  createPlanBoundingBoxGraphic,
  PlanBoundingBoxSymbolOptions,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";

export const FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS = {
  hover: new SimpleMarkerSymbol({
    color: [227, 139, 79, 0.95],
    size: 9,
    outline: { color: [180, 90, 40, 1], width: 1 },
  }),
  selected: new SimpleMarkerSymbol({
    color: [0, 200, 80, 0.95],
    size: 9,
    outline: { color: [0, 100, 40, 1], width: 1 },
  }),
} as const;

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

export function addFinishedPlanGeometryCentroidMarkers(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType,
  symbol: SimpleMarkerSymbol
) {
  for (const geometry of plan.geometries || []) {
    const centroid = geometryCentroid(geometry);
    if (!centroid) continue;

    layer.add(
      new Graphic({
        geometry: new Point({
          longitude: centroid.lon,
          latitude: centroid.lat,
          spatialReference: { wkid: 4326 },
        }),
        symbol,
        attributes: { kind: "geometry-centroid" },
      })
    );
  }
}
