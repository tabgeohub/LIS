import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export const STARRED_POINT_SYMBOL = new SimpleMarkerSymbol({
  style: "circle",
  size: 14,
  color: [255, 255, 255, 0],
  outline: {
    color: [0, 0, 255, 1],
    width: 2,
  },
});
