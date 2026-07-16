import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import type { PathPoint } from "./pathPlanUtils";

export function buildPathFeatureLayer(input: {
  selectedPlan: FinishedFlightPlanType;
  planPath: PathPoint[];
}) {
  const graphics = input.planPath.map((p, index) =>
    new Graphic({
      geometry: new Point({ longitude: p.longitude, latitude: p.latitude }),
      symbol: new SimpleMarkerSymbol({
        color: "red",
        outline: { color: "black", width: 0.5 },
        size: "6px",
      }),
      attributes: {
        OBJECTID: index,
        planId: input.selectedPlan.id,
        vluchtnummer: input.selectedPlan.vluchtnummer,
        ...p,
      },
    })
  );

  return new FeatureLayer({
    source: graphics,
    fields: [
      { name: "OBJECTID", type: "oid" },
      { name: "planId", type: "string" },
      { name: "vluchtnummer", type: "string" },
      { name: "latitude", type: "double" },
      { name: "longitude", type: "double" },
      { name: "altitude", type: "double" },
      { name: "speed", type: "double" },
      { name: "rotationAngle", type: "double" },
    ],
    objectIdField: "OBJECTID",
    geometryType: "point",
    spatialReference: { wkid: 4326 },
    title: "PathPoints",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: "red",
        size: 6,
        outline: { color: "black", width: 0.5 },
      },
    },
  });
}

export function addPathLayerBelowPoints(input: {
  mapView: __esri.MapView;
  pathLayer: FeatureLayer;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
}) {
  const { mapView, pathLayer, pointsGraphicsLayer } = input;
  const map = mapView.map;
  if (!map) return;

  if (pointsGraphicsLayer) {
    const pointsLayerIndex = map.layers.indexOf(pointsGraphicsLayer);
    if (pointsLayerIndex >= 0) {
      map.add(pathLayer, pointsLayerIndex);
    } else {
      map.add(pathLayer);
    }
  } else {
    map.add(pathLayer);
  }

  if (
    pointsGraphicsLayer &&
    map.layers.includes(pointsGraphicsLayer) &&
    map.layers.includes(pathLayer)
  ) {
    const pathIndex = map.layers.indexOf(pathLayer);
    const pointsIndex = map.layers.indexOf(pointsGraphicsLayer);
    if (pointsIndex < pathIndex) {
      map.reorder(pointsGraphicsLayer, pathIndex + 1);
    }
  }
}
