import { createNewPointEvent } from "Components/HomePage/helpers/ArcGISHelpers/createNewPointEvent";
import type { AddPointStepMapClickState } from "./addPointStepMapClickTypes";

export function handleAddPointStepMapClick(
  input: AddPointStepMapClickState & {
    event: __esri.ViewClickEvent;
    redGraphicsLayer: __esri.GraphicsLayer;
  }
): void {
  if (!input.event.mapPoint.longitude || !input.event.mapPoint.latitude) return;

  input.setMapClickedNotify(input.mapClickedNotify + 1);

  input.setCurrentPoint({
    x: input.event.mapPoint.longitude,
    y: input.event.mapPoint.latitude,
  });

  createNewPointEvent(input);

  if (input.addPointStep === 1) {
    input.setAddPointStep(3);
  }
}
