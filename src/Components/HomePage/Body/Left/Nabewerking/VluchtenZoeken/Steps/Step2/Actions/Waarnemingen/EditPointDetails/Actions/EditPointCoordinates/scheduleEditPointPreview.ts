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

function canSchedulePreview(input: ScheduleEditPointPreviewInput): boolean {
  return Boolean(
    input.mapView &&
      input.redGraphicsLayer &&
      input.pointsGraphicsLayer &&
      input.selectedPoint &&
      input.longitude &&
      input.latitude
  );
}

export function scheduleEditPointPreview(
  input: ScheduleEditPointPreviewInput
): (() => void) | undefined {
  if (!canSchedulePreview(input)) return;

  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
    longitude,
    latitude,
  } = input;

  const timeoutId = setTimeout(() => {
    updatePreviewGraphics({
      mapView: mapView!,
      redGraphicsLayer: redGraphicsLayer!,
      pointsGraphicsLayer: pointsGraphicsLayer!,
      point: selectedPoint!,
      longitude,
      latitude,
    });
  }, 300);
  return () => clearTimeout(timeoutId);
}
