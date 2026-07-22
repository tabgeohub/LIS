/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { startPolygonDrawer } from "./polygonDrawer";
import { usePolygonSketchCleanup } from "./usePolygonSketchCleanup";
import { useAddToPlanStepSketch } from "./useAddToPlanStepSketch";

export function useAddToPlanSketch(step: number) {
  const { mapView } = useMapViewState();
  const { points, setPolygonPoints } = usePointsStore();
  const { sketchRef, graphicsLayerRef, createHandleRef, cleanupSketch } =
    usePolygonSketchCleanup(mapView);

  const initPolygonDrawer = useCallback(async () => {
    if (!mapView?.map) return;
    await startPolygonDrawer({
      mapView,
      cleanupSketch,
      sketchRef,
      graphicsLayerRef,
      createHandleRef,
      points,
      setPolygonPoints,
    });
  }, [mapView, cleanupSketch, points, setPolygonPoints]);

  useAddToPlanStepSketch({ step, initPolygonDrawer, cleanupSketch });
  useEffect(() => () => cleanupSketch(), [cleanupSketch]);
}
