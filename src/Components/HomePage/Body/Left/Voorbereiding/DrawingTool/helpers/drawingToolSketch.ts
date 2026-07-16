import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { CURRENTLY_DRAWING_ATTRIBUTE } from "./drawingToolMapCleanup";

function symbolForTool(
  tool: string
): SimpleMarkerSymbol | SimpleLineSymbol | SimpleFillSymbol | null {
  if (tool === "point") {
    return new SimpleMarkerSymbol({
    color: [226, 119, 40],
    outline: { color: [255, 255, 255], width: 2 },
    size: 12,
    });
  }
  if (tool === "line") {
    return new SimpleLineSymbol({ color: [0, 0, 255, 1], width: 3 });
  }
  if (tool === "polygon") {
    return new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      outline: { color: [0, 0, 255, 1], width: 2 },
    });
  }
  return null;
}

const GEOMETRY_TYPE_BY_TOOL: Record<string, "polyline" | "polygon"> = {
  line: "polyline",
  polygon: "polygon",
};

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
