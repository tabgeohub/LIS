import { useEffect } from "react";
import {
  scheduleEditPointPreview,
  type ScheduleEditPointPreviewInput,
} from "./scheduleEditPointPreview";

export function useEditPointPreviewGraphics(
  input: ScheduleEditPointPreviewInput
) {
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
