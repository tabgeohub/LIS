import {
  createPointGraphics,
  type PointData,
} from "./createPointGraphic";

const BLUE_POINT_SYMBOL = {
  color: "blue",
  size: 10,
  style: "circle" as const,
  outlineColor: "white",
  outlineWidth: 1,
};

export function placeBluePointGraphics(input: {
  points: PointData[];
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
}): __esri.Graphic[] {
  if (!input.points.length) return [];

  const graphics = createPointGraphics(input.points, {
    symbolOptions: BLUE_POINT_SYMBOL,
    transformCoordinates: true,
  });
  if (!graphics.length) return [];

  if (input.pointsGraphicsLayer) {
    input.pointsGraphicsLayer.addMany(graphics);
    return [];
  }

  if (input.mapView) {
    input.mapView.graphics.addMany(graphics);
    return graphics;
  }

  return [];
}
