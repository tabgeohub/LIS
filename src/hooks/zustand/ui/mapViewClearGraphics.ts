import type { MapViewState } from "./mapViewStateTypes";

export function createMapViewClearGraphics(
  get: () => Pick<
    MapViewState,
    | "graphicsLayer"
    | "graphicsLayerHover"
    | "yellowGraphicsLayer"
    | "yellowGeometriesGraphicsLayer"
  >
) {
  return () => {
    const {
      graphicsLayer,
      graphicsLayerHover,
      yellowGraphicsLayer,
      yellowGeometriesGraphicsLayer,
    } = get();
    // geometriesGraphicsLayer is not cleared - geometries persist
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    yellowGraphicsLayer?.removeAll();
    yellowGeometriesGraphicsLayer?.removeAll();
  };
}
