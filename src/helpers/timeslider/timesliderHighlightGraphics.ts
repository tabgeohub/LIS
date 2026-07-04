import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import {
  closePolygonRing,
  geometryPathFromPoints,
  isPolygonGeometryType,
} from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedFlightPlanType } from "Types/finished_plans";

export const TIMESLIDER_HIGHLIGHT_LABEL = "timeslider-selected-plan-highlight";

const pointSymbol = new SimpleMarkerSymbol({
  color: [255, 213, 0, 0.95],
  size: 11,
  style: "circle",
  outline: { color: [255, 255, 255, 1], width: 2 },
});

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

function addPlanPointHighlights(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType
) {
  for (const p of plan.points_data || []) {
    const coords = getPointCoordinates(p, true);
    if (!coords) continue;
    layer.add(
      new Graphic({
        geometry: new Point({
          longitude: coords.longitude,
          latitude: coords.latitude,
          spatialReference: { wkid: 4326 },
        }),
        symbol: pointSymbol,
        attributes: {
          label: TIMESLIDER_HIGHLIGHT_LABEL,
          kind: "point",
          planId: plan.id,
          pointId: p.id,
        },
      })
    );
  }
}

function addPlanGeometryHighlights(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType
) {
  for (const g of plan.geometries || []) {
    const path = geometryPathFromPoints(g.points);
    if (path.length < 2) continue;

    const isPolygon = isPolygonGeometryType(g.geometry_type);

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

export function addPlanHighlightGraphics(input: {
  layer: __esri.GraphicsLayer;
  plans: FinishedFlightPlanType[];
  selectedPlanIds: number[];
}) {
  const selectedIdsSet = new Set(input.selectedPlanIds);
  const selectedPlans = input.plans.filter((p) => selectedIdsSet.has(p.id));

  for (const plan of selectedPlans) {
    addPlanPointHighlights(input.layer, plan);
    addPlanGeometryHighlights(input.layer, plan);
  }
}
