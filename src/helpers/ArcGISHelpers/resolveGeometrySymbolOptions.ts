import type { GeometrySymbolOptions } from "./geometryGraphicTypes";
import { DEFAULT_GEOMETRY_SYMBOL } from "./geometryNamedSymbolsB";

export function resolveGeometrySymbolOptions(
  symbol: GeometrySymbolOptions
): Required<GeometrySymbolOptions> {
  return {
    fillColor: symbol.fillColor ?? DEFAULT_GEOMETRY_SYMBOL.fillColor,
    outlineColor: symbol.outlineColor ?? DEFAULT_GEOMETRY_SYMBOL.outlineColor,
    lineColor: symbol.lineColor ?? DEFAULT_GEOMETRY_SYMBOL.lineColor,
    outlineWidth: symbol.outlineWidth ?? DEFAULT_GEOMETRY_SYMBOL.outlineWidth,
    lineWidth: symbol.lineWidth ?? DEFAULT_GEOMETRY_SYMBOL.lineWidth,
  };
}
