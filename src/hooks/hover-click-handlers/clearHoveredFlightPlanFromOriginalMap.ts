import { FlightPlanType } from "Types";
import type { OriginalGraphicsMapRef } from "./hoverFlightPlanFromOriginalMap";

/** Shared cleanup for hover-highlighted flight plan rows. */
export function clearHoveredFlightPlanFromOriginalMap(input: {
  plan: FlightPlanType;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): void {
  if (!input.graphicsLayer || !input.graphicsLayerHover) return;

  input.graphicsLayerHover.removeAll();

  const map = input.originalGraphicsMap.current as Map<
    string | number,
    __esri.Graphic
  >;
  const originalGraphic =
    map.get(input.plan.id) ?? map.get(String(input.plan.id));

  if (originalGraphic) {
    input.graphicsLayer.add(originalGraphic);
  }
}
