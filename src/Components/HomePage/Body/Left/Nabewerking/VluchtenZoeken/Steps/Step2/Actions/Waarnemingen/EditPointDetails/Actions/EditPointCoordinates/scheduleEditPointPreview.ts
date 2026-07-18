import type { FinishedPointType } from "Types/finished_plans";
import { updatePreviewGraphics } from "./pointMapGraphics";

export type ScheduleEditPointPreviewInput = {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  selectedPoint: FinishedPointType | null;
  longitude: number;
  latitude: number;
};

export function scheduleEditPointPreview(
  input: ScheduleEditPointPreviewInput
): (() => void) | undefined {
  const { mapView, redGraphicsLayer, pointsGraphicsLayer, selectedPoint } =
    input;
  if (!mapView || !redGraphicsLayer || !pointsGraphicsLayer || !selectedPoint)
    return;
  if (!input.longitude || !input.latitude) return;
  const timeoutId = setTimeout(() => {
    updatePreviewGraphics({
      mapView,
      redGraphicsLayer,
      pointsGraphicsLayer,
      point: selectedPoint,
      longitude: input.longitude,
      latitude: input.latitude,
    });
  }, 300);
  return () => clearTimeout(timeoutId);
}
