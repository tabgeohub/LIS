import { useEffect } from "react";
import type { FinishedPointType } from "Types/finished_plans";
import { scheduleEditPointPreview } from "./scheduleEditPointPreview";

export function useEditPointPreviewGraphics(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  selectedPoint: FinishedPointType | null;
  longitude: number;
  latitude: number;
}) {
  useEffect(() => {
    return scheduleEditPointPreview(input);
  }, [
    input.longitude,
    input.latitude,
    input.mapView,
    input.redGraphicsLayer,
    input.pointsGraphicsLayer,
    input.selectedPoint,
  ]);
}
