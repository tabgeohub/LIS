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
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useContent } from "hooks/useContent";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";

export default function Step1() {
  const { mapView } = useMapViewState();
  const { setSelectedTab, selectedTab } = useTabState();
  const content = useContent();
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

  // Cleanup when tab changes away from tekengereedschap
  useEffect(() => {
    if (selectedTab !== "tekengereedschap") {
      // Delete all graphics with "currently-drawing" attribute
      clearCurrentlyDrawingGraphics();

      // Reset cursor
      if (mapView?.container) {
        mapView.container.style.cursor = "";
      }
      // Cancel any active sketchViewModel
      if (sketchViewModel) {
        try {
          sketchViewModel.cancel();
        } catch (e) {
          // Ignore errors if already cancelled
        }
        try {
          sketchViewModel.destroy();
        } catch (e) {
          // Ignore errors if already destroyed
        }
        setSketchViewModel(null);
      }
      setSelectedTool(null);
    }
  }, [selectedTab, mapView, sketchViewModel]);

  // Cleanup on unmount - only reset cursor and cleanup sketchViewModel
  // Don't delete graphics here - they should persist when moving to Step2
  // Graphics will be deleted by:
  // 1. Tab change cleanup (when tab changes away from tekengereedschap)
  // 2. Explicit cancel/back actions
  // 3. Step2 cleanup when going back to Step1
  useEffect(() => {
    return () => {
      // Reset cursor
      if (mapView?.container) {
        mapView.container.style.cursor = "";
      }
      // Cancel any active sketchViewModel
      if (sketchViewModel) {
        sketchViewModel.cancel();
        sketchViewModel.destroy();
      }
    };
  }, [mapView, sketchViewModel]);

  const resetCursor = () => {
    if (mapView?.container) {
      mapView.container.style.cursor = "";
    }
    // Cancel any active sketchViewModel
    if (sketchViewModel) {
      sketchViewModel.cancel();
      sketchViewModel.destroy();
      setSketchViewModel(null);
    }
    setSelectedTool(null);
  };

  const clearCurrentlyDrawingGraphics = () => {
    if (!mapView) return;

    // Search all graphics layers for graphics with "currently-drawing" attribute
    const layers = mapView.map.layers;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers.getItemAt(i);
      if (layer instanceof GraphicsLayer) {
        const graphics = layer.graphics.toArray();
        graphics.forEach((graphic) => {
          if (graphic.attributes && graphic.attributes["currently-drawing"] === true) {
            try {
              layer.remove(graphic);
            } catch (err) {
              // Ignore removal errors
            }
          }
        });
      }
    }
  };

  const handleClear = () => {
    clearCurrentlyDrawingGraphics();
    resetCursor();
  };

  const handleCancel = () => {
    clearCurrentlyDrawingGraphics();
    resetCursor();
    setSelectedTab("none");
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className="px-3 py-2 rounded text-xs font-semibold transition-all duration-200 bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg cursor-pointer"
        >
          {content.common.annuleren}
        </motion.button>
      </motion.div>
    </div>
  );
}
