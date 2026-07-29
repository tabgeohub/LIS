import { useCallback, useRef } from "react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export function usePolygonSketchCleanup(
  mapView: __esri.MapView | null | undefined
) {
  const sketchRef = useRef<SketchViewModel | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const createHandleRef = useRef<__esri.Handle | null>(null);

  const cleanupSketch = useCallback(() => {
    createHandleRef.current?.remove();
    createHandleRef.current = null;
    if (sketchRef.current) {
      sketchRef.current.cancel();
      sketchRef.current.destroy();
      sketchRef.current = null;
    }
    if (graphicsLayerRef.current) {
      graphicsLayerRef.current.removeAll();
      if (mapView?.map) mapView.map.remove(graphicsLayerRef.current);
      graphicsLayerRef.current = null;
    }
  }, [mapView]);

  return { sketchRef, graphicsLayerRef, createHandleRef, cleanupSketch };
}
