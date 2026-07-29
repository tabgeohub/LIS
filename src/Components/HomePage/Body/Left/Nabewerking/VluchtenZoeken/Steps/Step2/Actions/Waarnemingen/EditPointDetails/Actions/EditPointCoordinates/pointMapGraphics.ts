import createPoint from "Components/HomePage/helpers/ArcGISHelpers/createPoint";
import type { FinishedPointType } from "Types/finished_plans";
import {
  YELLOW_POINT_SYMBOL,
  reorderRedLayerOnTop,
  replacePointGraphic,
} from "./pointMapGraphicHelpers";

export { replacePointGraphic, reorderRedLayerOnTop } from "./pointMapGraphicHelpers";
export { restoreOriginalPointGraphic } from "./restoreOriginalPointGraphic";

export function showRedMarkerAt(input: {
  redGraphicsLayer: __esri.GraphicsLayer;
  mapView: __esri.MapView;
  longitude: number;
  latitude: number;
}) {
  input.redGraphicsLayer.removeAll();
  input.redGraphicsLayer.add(createPoint(input.longitude, input.latitude));
  reorderRedLayerOnTop(input.mapView, input.redGraphicsLayer);
}

function replacePointsLayerAt(input: {
  pointsGraphicsLayer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  replacePointGraphic({
    layer: input.pointsGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
  });
}

export function updatePreviewGraphics(input: {
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
  pointsGraphicsLayer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  replacePointsLayerAt(input);
  showRedMarkerAt({
    redGraphicsLayer: input.redGraphicsLayer,
    mapView: input.mapView,
    longitude: input.longitude,
    latitude: input.latitude,
  });
}

export function updateSavedGraphics(input: {
  mapView: __esri.MapView;
  pointsGraphicsLayer: __esri.GraphicsLayer;
  yellowGraphicsLayer: __esri.GraphicsLayer;
  redGraphicsLayer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  replacePointsLayerAt(input);
  replacePointGraphic({
    layer: input.yellowGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
    symbol: YELLOW_POINT_SYMBOL,
  });
  input.redGraphicsLayer.removeAll();
}
