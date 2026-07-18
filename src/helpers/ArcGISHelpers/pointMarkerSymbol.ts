import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { PointSymbolOptions } from "./createPointGraphic";

export const DEFAULT_POINT_SYMBOL_OPTIONS: Required<PointSymbolOptions> = {
  color: "blue",
  size: 12,
  style: "circle",
  outlineColor: "white",
  outlineWidth: 1,
};

function pickSymbolOption<K extends keyof Required<PointSymbolOptions>>(
  options: PointSymbolOptions,
  key: K
): Required<PointSymbolOptions>[K] {
  return (options[key] ??
    DEFAULT_POINT_SYMBOL_OPTIONS[key]) as Required<PointSymbolOptions>[K];
}

export function mergePointSymbolOptions(
  symbolOptions: PointSymbolOptions = {}
): Required<PointSymbolOptions> {
  return {
    color: pickSymbolOption(symbolOptions, "color"),
    size: pickSymbolOption(symbolOptions, "size"),
    style: pickSymbolOption(symbolOptions, "style"),
    outlineColor: pickSymbolOption(symbolOptions, "outlineColor"),
    outlineWidth: pickSymbolOption(symbolOptions, "outlineWidth"),
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
