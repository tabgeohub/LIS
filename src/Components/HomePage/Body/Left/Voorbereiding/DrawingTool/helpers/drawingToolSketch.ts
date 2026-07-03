import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import type __esri from "@arcgis/core/interfaces";
import { CURRENTLY_DRAWING_ATTRIBUTE } from "./drawingToolMapCleanup";

const DRAWING_SYMBOLS: Record<string, __esri.SymbolProperties> = {
  point: {
    type: "simple-marker",
    color: [226, 119, 40],
    outline: { color: [255, 255, 255], width: 2 },
    size: 12,
  },
  line: {
    type: "simple-line",
    color: [0, 0, 255, 1],
    width: 3,
  },
  polygon: {
    type: "simple-fill",
    color: [0, 0, 0, 0],
    outline: { color: [0, 0, 255, 1], width: 2 },
  },
};

const GEOMETRY_TYPE_BY_TOOL: Record<string, "polyline" | "polygon"> = {
  line: "polyline",
  polygon: "polygon",
};

function symbolForTool(tool: string): __esri.Symbol | null {
  const props = DRAWING_SYMBOLS[tool];
  if (!props) return null;
  if (tool === "point") return new SimpleMarkerSymbol(props as __esri.SimpleMarkerSymbolProperties);
  if (tool === "line") return new SimpleLineSymbol(props as __esri.SimpleLineSymbolProperties);
  return new SimpleFillSymbol(props as __esri.SimpleFillSymbolProperties);
}

export function attachSketchCreateHandler(
  sketch: SketchViewModel,
  tool: string
) {
  sketch.on("create", (event) => {
    if (event.state !== "complete") return;

    event.graphic.attributes = {
      ...event.graphic.attributes,
      [CURRENTLY_DRAWING_ATTRIBUTE]: true,
    };

    const symbol = symbolForTool(tool);
    if (symbol) event.graphic.symbol = symbol;
  });
}

export function geometryTypeForTool(tool: string): "polyline" | "polygon" | null {
  return GEOMETRY_TYPE_BY_TOOL[tool] ?? null;
}
