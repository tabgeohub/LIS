/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createMapPointerHoverHandler } from "./mapPointerHoverHandler";

export function useMapHoverHighlight() {
  const {
    mapView,
    pointsGraphicsLayer,
    graphicsLayerHover,
    selectedPointGraphicsLayer,
    yellowGraphicsLayer,
    geometriesGraphicsLayer,
  } = useMapViewState();

  useEffect(() => {
    if (!mapView) return;

    const includeLayers = [
      pointsGraphicsLayer,
      selectedPointGraphicsLayer,
      yellowGraphicsLayer,
      geometriesGraphicsLayer,
    ].filter(Boolean) as (__esri.Layer | __esri.GraphicsLayer)[];

    const { setHovered } = useHoveredGraphicState.getState();

    const handlePointerMove = createMapPointerHoverHandler({
      mapView,
      includeLayers,
      graphicsLayerHover,
      setHovered,
    });

    const pointerHandle = mapView.on("pointer-move", handlePointerMove);

    return () => {
      pointerHandle.remove();
      graphicsLayerHover?.removeAll();
      setHovered(null);
    };
  }, [
    mapView,
    pointsGraphicsLayer,
    graphicsLayerHover,
    selectedPointGraphicsLayer,
    yellowGraphicsLayer,
    geometriesGraphicsLayer,
  ]);
}
