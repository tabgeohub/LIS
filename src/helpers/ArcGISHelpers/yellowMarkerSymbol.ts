import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export const YELLOW_MARKER_SYMBOL = new SimpleMarkerSymbol({
  color: "yellow",
  size: 12,
  style: "circle",
  outline: {
    color: "white",
    width: 1,
  },
});
