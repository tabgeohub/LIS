import type { MutableRefObject } from "react";
import { findHoveredMapGraphic, toHoveredState } from "./hoverMapGraphic";

type PinRefs = MutableRefObject<
  Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
>;

export function registerMapHoverHandler(input: {
  mapView: __esri.MapView;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null;
  pinRefs?: PinRefs;
  checkMapContainer: boolean;
  onHovered: (value: { id: number; label: string } | null) => void;
}) {
  return input.mapView.on("pointer-move", async (event) => {
    if (input.checkMapContainer) {
      const target = event.native.target as HTMLElement;
      if (!input.mapView.container?.contains(target)) return;
    }

    const hit = await input.mapView.hitTest(event);
    const graphic = findHoveredMapGraphic({
      results: hit.results,
      pointsGraphicsLayer: input.pointsGraphicsLayer,
      geometriesGraphicsLayer: input.geometriesGraphicsLayer,
      pinRefs: input.pinRefs,
    });
    input.onHovered(graphic ? toHoveredState(graphic) : null);
  });
}
