import { placeBluePointGraphics } from "./placeBluePointGraphics";
import type { PointData } from "./createPointGraphic";

export function removeOwnedBluePointGraphics(
  mapView: __esri.MapView | null,
  graphics: __esri.Graphic[]
): __esri.Graphic[] {
  if (mapView && graphics.length) {
    try {
      mapView.graphics.removeMany(graphics);
    } catch {
      // Navigation may dispose graphics before the owning effect is cleaned up.
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
  const cleared = removeOwnedBluePointGraphics(
    input.mapView,
    input.ownedGraphics
  );
  input.pointsGraphicsLayer?.removeAll();

  const placed = placeBluePointGraphics({
    points: input.points,
    mapView: input.mapView,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
  });

  return placed.length ? placed : cleared;
}
