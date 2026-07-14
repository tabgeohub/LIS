import {
  createPointGraphics,
  type PointData,
} from "@helpers/ArcGISHelpers/createPointGraphic";

const BLUE_POINT_SYMBOL = {
  color: "blue",
  size: 10,
  style: "circle" as const,
  outlineColor: "white",
  outlineWidth: 1,
};

export function removeOwnedBluePointGraphics(
  mapView: __esri.MapView | null,
  graphics: __esri.Graphic[]
): __esri.Graphic[] {
  if (mapView && graphics.length) {
    try {
      mapView.graphics.removeMany(graphics);
    } catch {
      // The view may already have disposed the graphics during navigation.
    }
  }
  return [];
}

export function syncBluePointGraphics(input: {
  points: PointData[];
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  ownedGraphics: __esri.Graphic[];
}): __esri.Graphic[] {
  let ownedGraphics = removeOwnedBluePointGraphics(
    input.mapView,
    input.ownedGraphics
  );
  input.pointsGraphicsLayer?.removeAll();

  if (!input.points.length) return ownedGraphics;

  const graphics = createPointGraphics(input.points, {
    symbolOptions: BLUE_POINT_SYMBOL,
    transformCoordinates: true,
  });
  if (!graphics.length) return ownedGraphics;

  if (input.pointsGraphicsLayer) {
    input.pointsGraphicsLayer.addMany(graphics);
  } else if (input.mapView) {
    input.mapView.graphics.addMany(graphics);
    ownedGraphics = graphics;
  }

  return ownedGraphics;
}
