import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export const SEARCH_RESULT_POINT_OUTLINE_SYMBOL = new SimpleMarkerSymbol({
  style: "circle",
  size: 14,
  color: [255, 255, 255, 0],
  outline: {
    color: [255, 255, 0, 1],
    width: 4,
  },
});
