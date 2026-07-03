import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { PointSymbolOptions } from "./createPointGraphic";

export const DEFAULT_POINT_SYMBOL_OPTIONS: Required<PointSymbolOptions> = {
  color: "blue",
  size: 12,
  style: "circle",
  outlineColor: "white",
  outlineWidth: 1,
};

export function mergePointSymbolOptions(
  symbolOptions: PointSymbolOptions = {}
): Required<PointSymbolOptions> {
  return {
    color: symbolOptions.color ?? DEFAULT_POINT_SYMBOL_OPTIONS.color,
    size: symbolOptions.size ?? DEFAULT_POINT_SYMBOL_OPTIONS.size,
    style: symbolOptions.style ?? DEFAULT_POINT_SYMBOL_OPTIONS.style,
    outlineColor:
      symbolOptions.outlineColor ?? DEFAULT_POINT_SYMBOL_OPTIONS.outlineColor,
    outlineWidth:
      symbolOptions.outlineWidth ?? DEFAULT_POINT_SYMBOL_OPTIONS.outlineWidth,
  };
}

export function buildPointMarkerSymbol(
  symbolOptions: PointSymbolOptions = {}
): SimpleMarkerSymbol {
  const finalSymbolOptions = mergePointSymbolOptions(symbolOptions);
  return new SimpleMarkerSymbol({
    color: finalSymbolOptions.color,
    size: finalSymbolOptions.size,
    style: finalSymbolOptions.style,
    outline: {
      color: finalSymbolOptions.outlineColor,
      width: finalSymbolOptions.outlineWidth,
    },
  });
}
