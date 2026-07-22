import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { FinishedPointType } from "Types/finished_plans";

export const BLUE_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: "blue",
  size: 12,
  style: "circle",
  outline: { color: "white", width: 1 },
});

export const YELLOW_POINT_SYMBOL = new SimpleMarkerSymbol({
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

export function findGraphicByPointId(
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
