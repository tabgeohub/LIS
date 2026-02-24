import { useEffect, useRef } from "react";
import Form from "./Form";
import Buttons from "./Buttons";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export default function Step2() {
  const { mapView } = useMapViewState();
  const { selectedTab } = useTabState();
  const { step, clear } = useDrawingStore();
  const isFirstMount = useRef(true);

  // Cleanup when tab changes away from tekengereedschap or when step changes back to 1
  useEffect(() => {
    // Skip on first mount - we don't want to delete graphics when Step2 first loads
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

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

    const resetCursor = () => {
      if (mapView?.container) {
        mapView.container.style.cursor = "";
      }
    };

    // Clear if tab changed away from tekengereedschap
    if (selectedTab !== "tekengereedschap") {
      clearCurrentlyDrawingGraphics();
      resetCursor();
      clear();
      return; // Early return to prevent further checks
    }

    // Clear if step changed back to 1 (user went back from Step2 to Step1)
    if (step === 1) {
      clearCurrentlyDrawingGraphics();
      resetCursor();
    }
  }, [selectedTab, step, mapView, clear]);

  // Cleanup on unmount - only if going back to Step1 or leaving the tab
  useEffect(() => {
    return () => {
      // Check if we're going back to Step1 (step will be 1) or leaving the tab
      const { step: currentStep } = useDrawingStore.getState();
      const { selectedTab: currentTab } = useTabState.getState();

      // Only delete graphics if:
      // 1. Tab changed away from tekengereedschap, OR
      // 2. Step is going back to 1 (user clicked back)
      if (currentTab !== "tekengereedschap" || currentStep === 1) {
        if (mapView) {
          // Delete all graphics with "currently-drawing" attribute
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
        }
      }

      if (mapView?.container) {
        mapView.container.style.cursor = "";
      }
    };
  }, [mapView]);

  return (
    <div className="max-h-[97%] p-2 overflow-y-auto thin-scrollbar">
      <Form />

      <Buttons />
    </div>
  );
}
