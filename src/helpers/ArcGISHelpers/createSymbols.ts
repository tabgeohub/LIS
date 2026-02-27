import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

/**
 * Pre-defined yellow marker symbol for selected/highlighted points
 * Used consistently across the application for visual consistency
 */
export const YELLOW_MARKER_SYMBOL = new SimpleMarkerSymbol({
  color: "yellow",
  size: 12,
  style: "circle",
  outline: {
    color: "white",
    width: 1,
  },
});

/**
 * Pre-defined starred point symbol (transparent fill with blue outline)
 * Used to indicate starred/favorited points
 */
export const STARRED_POINT_SYMBOL = new SimpleMarkerSymbol({
  style: "circle",
  size: 14,
  color: [255, 255, 255, 0], // Transparent fill
  outline: {
    color: [0, 0, 255, 1], // Blue outline
    width: 2,
  },
});

