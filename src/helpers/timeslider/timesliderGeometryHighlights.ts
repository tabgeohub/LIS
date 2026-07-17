import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import {
  closePolygonRing,
  geometryPathFromPoints,
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

export function addPlanGeometryHighlights(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType
) {
  for (const g of plan.geometries || []) {
    const path = geometryPathFromPoints(g.points);
    if (path.length < 2) continue;

    const isPolygon = isPolygonGeometryType(g.geometry_type ?? undefined);

    if (isPolygon && path.length >= 3) {
      layer.add(
        new Graphic({
          geometry: new Polygon({
            rings: [closePolygonRing(path)],
            spatialReference: { wkid: 4326 },
          }),
          symbol: polygonSymbol,
          attributes: {
            label: TIMESLIDER_HIGHLIGHT_LABEL,
            kind: "geometry",
            geometryType: "polygon",
            planId: plan.id,
            geometryId: g.id,
          },
        })
      );
      continue;
    }

    layer.add(
      new Graphic({
        geometry: new Polyline({
          paths: [path],
          spatialReference: { wkid: 4326 },
        }),
        symbol: lineSymbol,
        attributes: {
          label: TIMESLIDER_HIGHLIGHT_LABEL,
          kind: "geometry",
          geometryType: "line",
          planId: plan.id,
          geometryId: g.id,
        },
      })
    );
  }
}
