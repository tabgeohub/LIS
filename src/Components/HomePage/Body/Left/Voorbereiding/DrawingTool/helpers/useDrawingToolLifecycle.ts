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

export function useDrawingToolRootLifecycle(input: {
  mapView: MapView | null;
  selectedTab: string;
  clear: () => void;
  setStep: (value: number) => void;
}) {
  useEffect(() => {
    if (input.selectedTab !== DRAWING_TAB) {
      cleanupDrawingToolMap(input.mapView);
      input.clear();
      input.setStep(1);
    }

    return () => {
      cleanupDrawingToolMap(input.mapView);
      input.clear();
      input.setStep(1);
    };
  }, [input.mapView, input.selectedTab, input.clear, input.setStep]);
}

export function useDrawingToolStep1Lifecycle(input: {
  mapView: MapView | null;
  selectedTab: string;
  sketchViewModel: SketchViewModel | null;
  setSketchViewModel: (value: SketchViewModel | null) => void;
  setSelectedTool: (value: DrawingToolType) => void;
}) {
  useEffect(() => {
    if (input.selectedTab !== DRAWING_TAB) {
      clearCurrentlyDrawingGraphics(input.mapView);
      resetSketchSession({
        sketchViewModel: input.sketchViewModel,
        mapView: input.mapView,
        setSketchViewModel: input.setSketchViewModel,
        setSelectedTool: input.setSelectedTool,
        tolerant: true,
      });
    }
  }, [
    input.selectedTab,
    input.mapView,
    input.sketchViewModel,
    input.setSketchViewModel,
    input.setSelectedTool,
  ]);

  useEffect(() => {
    return () => {
      resetSketchSession({
        sketchViewModel: input.sketchViewModel,
        mapView: input.mapView,
      });
    };
  }, [input.mapView, input.sketchViewModel]);
}

export function useDrawingToolStep2Lifecycle(input: {
  mapView: MapView | null;
  selectedTab: string;
  step: number;
  clear: () => void;
}) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (input.selectedTab !== DRAWING_TAB) {
      clearCurrentlyDrawingGraphics(input.mapView);
      resetMapCursor(input.mapView);
      input.clear();
      return;
    }

    if (input.step === 1) {
      clearCurrentlyDrawingGraphics(input.mapView);
      resetMapCursor(input.mapView);
    }
  }, [input.selectedTab, input.step, input.mapView, input.clear]);

  useEffect(() => {
    return () => {
      const { step: currentStep } = useDrawingStore.getState();
      const { selectedTab: currentTab } = useTabState.getState();

      if (currentTab !== DRAWING_TAB || currentStep === 1) {
        clearCurrentlyDrawingGraphics(input.mapView);
      }

      resetMapCursor(input.mapView);
    };
  }, [input.mapView]);
}
