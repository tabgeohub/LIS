import { useMapHoverLayers } from "./useMapHoverLayers";
import { useMapHoverHighlightEffect } from "./useMapHoverHighlightEffect";

export function useMapHoverHighlight() {
  useMapHoverHighlightEffect(useMapHoverLayers());
}
