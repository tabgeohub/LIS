import { useEffect } from "react";
import type { FinishedPointType } from "Types/finished_plans";
import { updatePreviewGraphics } from "./pointMapGraphics";

export function useEditPointPreviewGraphics(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  selectedPoint: FinishedPointType | null;
  longitude: number;
  latitude: number;
}) {
  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
    longitude,
    latitude,
  } = input;

  useEffect(() => {
    if (!mapView || !redGraphicsLayer || !pointsGraphicsLayer || !selectedPoint)
      return;
    if (!longitude || !latitude) return;
    const timeoutId = setTimeout(() => {
      updatePreviewGraphics({
        mapView,
        redGraphicsLayer,
        pointsGraphicsLayer,
        point: selectedPoint,
        longitude,
        latitude,
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    longitude,
    latitude,
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
  ]);
}
