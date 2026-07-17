import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";

export function handleAddPointStepMapClick(input: {
  event: __esri.ViewClickEvent;
  redGraphicsLayer: __esri.GraphicsLayer;
  addPointStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setAddPointStep: (value: number) => void;
}): void {
  if (!input.event.mapPoint.longitude || !input.event.mapPoint.latitude) return;

  input.setMapClickedNotify(input.mapClickedNotify + 1);

  input.setCurrentPoint({
    x: input.event.mapPoint.longitude,
    y: input.event.mapPoint.latitude,
  });

  createNewPointEvent({
    event: input.event,
    redGraphicsLayer: input.redGraphicsLayer,
    setXCoord: input.setXCoord,
    setYCoord: input.setYCoord,
    setLatitude: input.setLatitude,
    setLongitude: input.setLongitude,
    setCurrentPoint: input.setCurrentPoint,
  });

  if (input.addPointStep === 1) {
    input.setAddPointStep(3);
  }
}
