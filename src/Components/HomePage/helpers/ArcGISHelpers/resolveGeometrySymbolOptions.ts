import type { GeometrySymbolOptions } from "./geometryGraphicTypes";
import { DEFAULT_GEOMETRY_SYMBOL } from "./geometryNamedSymbolsB";

function pickGeometrySymbolOption<K extends keyof Required<GeometrySymbolOptions>>(
  symbol: GeometrySymbolOptions,
  key: K
): Required<GeometrySymbolOptions>[K] {
  return (symbol[key] ??
    DEFAULT_GEOMETRY_SYMBOL[key]) as Required<GeometrySymbolOptions>[K];
}

export function resolveGeometrySymbolOptions(
  symbol: GeometrySymbolOptions
): Required<GeometrySymbolOptions> {
  return {
    fillColor: pickGeometrySymbolOption(symbol, "fillColor"),
    outlineColor: pickGeometrySymbolOption(symbol, "outlineColor"),
    lineColor: pickGeometrySymbolOption(symbol, "lineColor"),
    outlineWidth: pickGeometrySymbolOption(symbol, "outlineWidth"),
    lineWidth: pickGeometrySymbolOption(symbol, "lineWidth"),
  };
}
