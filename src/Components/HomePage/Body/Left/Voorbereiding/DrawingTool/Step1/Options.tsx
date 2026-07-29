import { TbLine, TbPolygon } from "react-icons/tb";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useEffect } from "react";
import { motion } from "framer-motion";
import MapView from "@arcgis/core/views/MapView";
import { classNames } from "@helpers/dom/classNames";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { destroySketchViewModel } from "../helpers/resetSketchSession";
import {
  attachSketchCreateHandler,
  geometryTypeForTool,
} from "../helpers/drawingToolSketch";

interface OptionsProps {
  selectedTool: "line" | "polygon" | null;
  setSelectedTool: (tool: "line" | "polygon" | null) => void;
  graphicsLayer: GraphicsLayer | null;
  setGraphicsLayer: (layer: GraphicsLayer | null) => void;
  sketchViewModel: SketchViewModel | null;
  setSketchViewModel: (viewModel: SketchViewModel | null) => void;
  mapView: MapView | null;
  handleClear: () => void;
}

function ensureGraphicsLayer(input: {
  mapView: MapView;
  graphicsLayer: GraphicsLayer | null;
  setGraphicsLayer: (layer: GraphicsLayer | null) => void;
}): GraphicsLayer {
  if (input.graphicsLayer) return input.graphicsLayer;
  if (!input.mapView.map) {
    throw new Error("Map is not available");
  }

  const layer = new GraphicsLayer({
    title: "Tekeninglaag",
    listMode: "hide",
  });
  input.mapView.map.add(layer);
  input.setGraphicsLayer(layer);
  return layer;
}

export default function Options({
  selectedTool,
  setSelectedTool,
  graphicsLayer,
  setGraphicsLayer,
  sketchViewModel,
  setSketchViewModel,
  mapView,
}: OptionsProps) {
  const cleanup = () => {
    destroySketchViewModel({
      sketchViewModel,
      setSketchViewModel,
      mapView,
    });
  };

  useEffect(() => cleanup, [sketchViewModel, mapView]);

  function startDrawingSession(tool: string) {
    if (!validateMapView(mapView) || !mapView) return;

    const layer = ensureGraphicsLayer({
      mapView,
      graphicsLayer,
      setGraphicsLayer,
    });
    const sketch = new SketchViewModel({
      view: mapView,
      layer,
      defaultCreateOptions: { mode: "click" },
    });

    setSketchViewModel(sketch);
    if (mapView.container) mapView.container.style.cursor = "crosshair";

    attachSketchCreateHandler(sketch, tool);

    const geometryType = geometryTypeForTool(tool);
    if (!geometryType) return;

    sketch.create(geometryType);
    setSelectedTool(tool as "line" | "polygon");
  }

  function handleDrawingTool(tool: string) {
    if (!validateMapView(mapView) || !mapView) return;

    if (selectedTool === tool) {
      cleanup();
      setSelectedTool(null);
      return;
    }

    cleanup();
    startDrawingSession(tool);
  }

  const tools = [
    { id: "line", label: "Lijn", icon: TbLine },
    { id: "polygon", label: "Veelhoek", icon: TbPolygon },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-10">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;

        return (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDrawingTool(tool.id)}
            className={classNames(
              "relative flex flex-col items-center justify-center gap-1.5",
              "p-3 rounded-xl border-2 transition-all duration-200",
              isSelected
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "bg-white border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full"
              />
            )}

            <div
              className={classNames(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                "transition-colors duration-200",
                isSelected ? "bg-white/20" : "bg-gray-100 group-hover:bg-primary/10"
              )}
            >
              <Icon
                className={classNames(
                  "h-5 w-5",
                  isSelected ? "text-white" : "text-primary"
                )}
              />
            </div>

            <span
              className={classNames(
                "text-xs font-semibold",
                isSelected ? "text-white" : "text-gray-800"
              )}
            >
              {tool.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
