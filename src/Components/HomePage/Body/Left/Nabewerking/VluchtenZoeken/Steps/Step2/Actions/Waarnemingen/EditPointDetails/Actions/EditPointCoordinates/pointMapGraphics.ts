import createPoint from "@helpers/ArcGISHelpers/createPoint";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { FinishedPointType } from "Types/finished_plans";

const BLUE_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: "blue",
  size: 12,
  style: "circle",
  outline: { color: "white", width: 1 },
});

const YELLOW_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: "yellow",
  size: 12,
  style: "circle",
  outline: { color: "white", width: 1 },
});

export function reorderRedLayerOnTop(
  mapView: __esri.MapView,
  redGraphicsLayer: __esri.GraphicsLayer
) {
  if (!mapView.map) return;
  mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
}

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

function findGraphicByPointId(
  layer: __esri.GraphicsLayer,
  pointId: number
): __esri.Graphic | undefined {
  return layer.graphics
    .toArray()
    .find((g) => g.attributes?.id === pointId);
}

function createPointGraphic(input: {
  point: FinishedPointType;
  longitude: number;
  latitude: number;
  symbol: SimpleMarkerSymbol;
}) {
  return new Graphic({
    geometry: new Point({
      longitude: input.longitude,
      latitude: input.latitude,
      spatialReference: { wkid: 4326 },
    }),
    symbol: input.symbol,
    attributes: { ...input.point, longitude: input.longitude, latitude: input.latitude },
  });
}

export function replacePointGraphic(input: {
  layer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
  symbol?: SimpleMarkerSymbol;
}) {
  const existing = findGraphicByPointId(input.layer, input.point.id);
  if (existing) input.layer.remove(existing);

  input.layer.add(
    createPointGraphic({
      point: input.point,
      longitude: input.longitude,
      latitude: input.latitude,
      symbol: input.symbol ?? BLUE_POINT_SYMBOL,
    })
  );
}

export function updatePreviewGraphics(input: {
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
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
  replacePointGraphic({
    layer: input.pointsGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
  });
  replacePointGraphic({
    layer: input.yellowGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
    symbol: YELLOW_POINT_SYMBOL,
  });
  input.redGraphicsLayer.removeAll();
}

export function restoreOriginalPointGraphic(input: {
  pointsGraphicsLayer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  const preview = findGraphicByPointId(input.pointsGraphicsLayer, input.point.id);
  const previewLon = (preview?.geometry as Point | undefined)?.longitude;
  if (!preview || previewLon === input.longitude) return;

  input.pointsGraphicsLayer.remove(preview);
  replacePointGraphic({
    layer: input.pointsGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
  });
}
