import { TbLine, TbPolygon } from "react-icons/tb";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useEffect } from "react";
import { motion } from "framer-motion";
import MapView from "@arcgis/core/views/MapView";
import { classNames } from "@helpers/classNames";

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

export default function Options({
  selectedTool,
  setSelectedTool,
  graphicsLayer,
  setGraphicsLayer,
  sketchViewModel,
  setSketchViewModel,
  mapView,
  handleClear,
}: OptionsProps) {
  // Cleanup function
  const cleanup = () => {
    if (sketchViewModel) {
      sketchViewModel.destroy();
      setSketchViewModel(null);
    }
    if (mapView?.container) {
      mapView.container.style.cursor = "";
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      // Note: Don't remove graphics layer on unmount, let it persist
    };
  }, []);

  // Enables drawing on the map according to the tool selected
  function handleDrawingTool(tool: string) {
    if (!mapView) return;

    // If same tool clicked, cancel drawing
    if (selectedTool === tool) {
      cleanup();
      setSelectedTool(null);
      return;
    }

    // Cleanup previous drawing session
    cleanup();

    // Get or create graphics layer
    let currentGraphicsLayer = graphicsLayer;
    if (!currentGraphicsLayer) {
      currentGraphicsLayer = new GraphicsLayer({
        title: "Tekeninglaag",
        listMode: "hide",
      });
      mapView.map.add(currentGraphicsLayer);
      setGraphicsLayer(currentGraphicsLayer);
    }

    // Create SketchViewModel
    const newSketchViewModel = new SketchViewModel({
      view: mapView,
      layer: currentGraphicsLayer,
      defaultCreateOptions: {
        mode: "click",
      },
    });

    setSketchViewModel(newSketchViewModel);

    if (mapView.container) {
      mapView.container.style.cursor = "crosshair";
    }

    // Handle geometry creation
    newSketchViewModel.on("create", (event) => {
      if (event.state === "complete") {
        const geometry = event.graphic.geometry;

        // Apply appropriate symbol based on geometry type
        let symbol;
        if (tool === "point") {
          symbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: { color: [255, 255, 255], width: 2 },
            size: 12,
          });
        } else if (tool === "line") {
          symbol = new SimpleLineSymbol({
            color: [0, 0, 255, 1], // Blue
            width: 3,
          });
        } else if (tool === "polygon") {
          symbol = new SimpleFillSymbol({
            color: [0, 0, 0, 0], // Empty inside (fully transparent)
            outline: { color: [0, 0, 255, 1], width: 2 }, // Blue outline
          });
        }

        if (symbol) {
          event.graphic.symbol = symbol;
        }
      }
    });

    // Start drawing based on tool type
    let geometryType: "polyline" | "polygon";

    if (tool === "line") {
      geometryType = "polyline";
    } else if (tool === "polygon") {
      geometryType = "polygon";
    } else {
      return;
    }

    // Start drawing
    newSketchViewModel.create(geometryType);

    setSelectedTool(tool);
  }

  const tools = [
    {
      id: "line",
      label: "Lijn",
      icon: TbLine,
    },
    {
      id: "polygon",
      label: "Veelhoek",
      icon: TbPolygon,
    },
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
            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full"
              />
            )}

            {/* Icon */}
            <div
              className={classNames(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                "transition-colors duration-200",
                isSelected
                  ? "bg-white/20"
                  : "bg-gray-100 group-hover:bg-primary/10"
              )}
            >
              <Icon
                className={classNames(
                  "h-5 w-5",
                  isSelected ? "text-white" : "text-primary"
                )}
              />
            </div>

            {/* Label */}
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
