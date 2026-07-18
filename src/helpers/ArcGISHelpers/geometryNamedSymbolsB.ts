import type { GeometrySymbolOptions } from "./geometryGraphicTypes";

export const GEOMETRY_SELECTION_SYMBOL: GeometrySymbolOptions = {
  fillColor: [0, 0, 0, 0],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 3,
  lineWidth: 4,
};

export const GEOMETRY_REPORT_SYMBOL: GeometrySymbolOptions = {
  fillColor: [255, 140, 0, 0.5],
  outlineColor: [255, 140, 0, 1],
  lineColor: [255, 140, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

export const DEFAULT_GEOMETRY_SYMBOL: Required<GeometrySymbolOptions> = {
  fillColor: [0, 0, 0, 0],
  outlineColor: [0, 0, 255, 1],
  lineColor: [0, 0, 255, 1],
  outlineWidth: 2,
  lineWidth: 3,
};
