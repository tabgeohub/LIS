import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import {
  closePolygonRing,
  isPolygonGeometryType,
} from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { TIMESLIDER_HIGHLIGHT_LABEL } from "./timesliderHighlightLabel";

const lineSymbol = new SimpleLineSymbol({
  color: [255, 213, 0, 0.95],
  width: 3,
  style: "solid",
});

const polygonSymbol = new SimpleFillSymbol({
  color: [255, 213, 0, 0.2],
  outline: { color: [255, 213, 0, 0.95], width: 3 },
  style: "solid",
});

type PlanGeometry = NonNullable<FinishedFlightPlanType["geometries"]>[number];

function highlightAttrs(
  plan: FinishedFlightPlanType,
  geometry: PlanGeometry,
  geometryType: "polygon" | "line"
) {
  return {
    label: TIMESLIDER_HIGHLIGHT_LABEL,
    kind: "geometry",
    geometryType,
    planId: plan.id,
    geometryId: geometry.id,
  };
}

export function createPlanGeometryHighlightGraphic(
  plan: FinishedFlightPlanType,
  geometry: PlanGeometry,
  path: number[][]
): Graphic {
  const isPolygon = isPolygonGeometryType(geometry.geometry_type ?? undefined);
  if (isPolygon && path.length >= 3) {
    return new Graphic({
      geometry: new Polygon({
        rings: [closePolygonRing(path)],
        spatialReference: { wkid: 4326 },
      }),
      symbol: polygonSymbol,
      attributes: highlightAttrs(plan, geometry, "polygon"),
    });
  }

  return new Graphic({
    geometry: new Polyline({
      paths: [path],
      spatialReference: { wkid: 4326 },
    }),
    symbol: lineSymbol,
    attributes: highlightAttrs(plan, geometry, "line"),
  });
}
