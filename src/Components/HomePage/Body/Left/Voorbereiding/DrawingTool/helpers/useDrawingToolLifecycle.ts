import MapView from "@arcgis/core/views/MapView";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useEffect, useRef } from "react";
import {
  cleanupDrawingToolMap,
  clearCurrentlyDrawingGraphics,
  resetMapCursor,
} from "./drawingToolMapCleanup";
import { DrawingToolType, resetSketchSession } from "./resetSketchSession";

const DRAWING_TAB = "tekengereedschap";

export function useDrawingToolRootLifecycle(
  mapView: MapView | null,
  selectedTab: string,
  clear: () => void,
  setStep: (value: number) => void
) {
  useEffect(() => {
    if (selectedTab !== DRAWING_TAB) {
      cleanupDrawingToolMap(mapView);
      clear();
      setStep(1);
    }

    return () => {
      cleanupDrawingToolMap(mapView);
      clear();
      setStep(1);
    };
  }, [mapView, selectedTab, clear, setStep]);
}

export function useDrawingToolStep1Lifecycle(
  mapView: MapView | null,
  selectedTab: string,
  sketchViewModel: SketchViewModel | null,
  setSketchViewModel: (value: SketchViewModel | null) => void,
  setSelectedTool: (value: DrawingToolType) => void
) {
  useEffect(() => {
    if (selectedTab !== DRAWING_TAB) {
      clearCurrentlyDrawingGraphics(mapView);
      resetSketchSession({
        sketchViewModel,
        mapView,
        setSketchViewModel,
        setSelectedTool,
        tolerant: true,
      });
    }
  }, [selectedTab, mapView, sketchViewModel, setSketchViewModel, setSelectedTool]);

  useEffect(() => {
    return () => {
      resetSketchSession({
        sketchViewModel,
        mapView,
      });
    };
  }, [mapView, sketchViewModel]);
}

export function useDrawingToolStep2Lifecycle(
  mapView: MapView | null,
  selectedTab: string,
  step: number,
  clear: () => void
) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (selectedTab !== DRAWING_TAB) {
      clearCurrentlyDrawingGraphics(mapView);
      resetMapCursor(mapView);
      clear();
      return;
    }

    if (step === 1) {
      clearCurrentlyDrawingGraphics(mapView);
      resetMapCursor(mapView);
    }
  }, [selectedTab, step, mapView, clear]);

  useEffect(() => {
    return () => {
      const { step: currentStep } = useDrawingStore.getState();
      const { selectedTab: currentTab } = useTabState.getState();

      if (currentTab !== DRAWING_TAB || currentStep === 1) {
        clearCurrentlyDrawingGraphics(mapView);
      }

      resetMapCursor(mapView);
    };
  }, [mapView]);
}
