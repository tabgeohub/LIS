import { FlightPlanType } from "Types";
import {
  resolveOriginalPlanGraphic,
  type OriginalGraphicsMapRef,
} from "./resolveOriginalPlanGraphic";

/** Shared cleanup for hover-highlighted flight plan rows. */
export function clearHoveredFlightPlanFromOriginalMap(input: {
  plan: FlightPlanType;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): void {
  if (!input.graphicsLayer || !input.graphicsLayerHover) return;

  input.graphicsLayerHover.removeAll();

  const originalGraphic = resolveOriginalPlanGraphic(input);
  if (originalGraphic) {
    input.graphicsLayer.add(originalGraphic);
  }
}
