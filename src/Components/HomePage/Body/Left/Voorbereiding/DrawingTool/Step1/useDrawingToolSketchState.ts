import { useState } from "react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useDrawingToolStep1Lifecycle } from "../helpers/useDrawingToolLifecycle";
import { useGraphicsLayerHasItems } from "../helpers/useGraphicsLayerHasItems";

export function useDrawingToolSketchState() {
  const { mapView } = useMapViewState();
  const { selectedTab } = useTabState();
  const [selectedTool, setSelectedTool] = useState<"line" | "polygon" | null>(
    null
  );
  const [sketchViewModel, setSketchViewModel] =
    useState<SketchViewModel | null>(null);
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | null>(
    null
  );
  useDrawingToolStep1Lifecycle({
    mapView,
    selectedTab,
    sketchViewModel,
    setSketchViewModel,
    setSelectedTool,
  });
  return {
    mapView,
    selectedTool,
    setSelectedTool,
    sketchViewModel,
    setSketchViewModel,
    graphicsLayer,
    setGraphicsLayer,
    hasGraphics: useGraphicsLayerHasItems(graphicsLayer),
  };
}
