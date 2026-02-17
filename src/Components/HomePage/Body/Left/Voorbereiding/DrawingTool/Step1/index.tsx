import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useState, useEffect } from "react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Options from "./Options";
import Text from "./Text";
import ClearButton from "./ClearButton";
import { motion } from "framer-motion";
import { TbPencil } from "react-icons/tb";
import ConfirmButton from "./ConfirmButton";

export default function Step1() {
  const { mapView } = useMapViewState();
  const [selectedTool, setSelectedTool] = useState<"line" | "polygon" | null>(
    null
  );
  const [sketchViewModel, setSketchViewModel] = useState<SketchViewModel | null>(null);
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | null>(null);
  const [hasGraphics, setHasGraphics] = useState(false);

  // Monitor graphics layer for changes
  useEffect(() => {
    if (!graphicsLayer) {
      setHasGraphics(false);
      return;
    }

    const updateGraphicsCount = () => {
      setHasGraphics(graphicsLayer.graphics.length > 0);
    };

    // Initial check
    updateGraphicsCount();

    // Watch for changes using graphics collection events
    const handle = graphicsLayer.graphics.on("change", updateGraphicsCount);

    return () => {
      handle.remove();
    };
  }, [graphicsLayer]);

  const handleClear = () => {
    if (graphicsLayer) {
      graphicsLayer.removeAll();
    }
    setSelectedTool(null);
    if (mapView?.container) {
      mapView.container.style.cursor = "";
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <TbPencil className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            Tekengereedschap
          </h3>
        </div>
        <p className="text-[12px] text-gray-600 leading-relaxed pl-10">
          Selecteer een type tekenhulpmiddel om vormen op de kaart te maken.
        </p>
      </motion.div>

      {/* Tool Selection */}
      <Options
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        graphicsLayer={graphicsLayer}
        setGraphicsLayer={setGraphicsLayer}
        sketchViewModel={sketchViewModel}
        setSketchViewModel={setSketchViewModel}
        mapView={mapView}
        handleClear={handleClear}
      />

      {/* Instructions */}
      <Text selectedTool={selectedTool} />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="mt-4 flex justify-end gap-2"
      >
        <ClearButton onClear={handleClear} hasGraphics={hasGraphics} />
        <ConfirmButton graphicsLayer={graphicsLayer} hasGraphics={hasGraphics} />
      </motion.div>
    </div>
  );
}
