import toast from "react-hot-toast";
import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";
import { isNearExistingPoint } from "./Steps/Step2/isNearExistingPoint";

export type EnrichedAddPointClickInput = {
  event: __esri.ViewClickEvent;
  points: import("Types").EnrichedPointType[];
  nearPointToast: string;
  mapClickedNotify: number;
  step: number;
  redGraphicsLayer: __esri.GraphicsLayer;
  setMapClickedNotify: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setStep: (value: number) => void;
  logAction: (input: { message: string; newData?: unknown }) => void;
};

export function handleEnrichedAddPointClick(
  input: EnrichedAddPointClickInput
): void {
  const lon = input.event.mapPoint.longitude;
  const lat = input.event.mapPoint.latitude;
  if (!lon || !lat) return;

  if (isNearExistingPoint(lon, lat, input.points)) {
    toast.error(input.nearPointToast);
    return;
  }

  input.setMapClickedNotify(input.mapClickedNotify + 1);
  createNewPointEvent({
    event: input.event,
    redGraphicsLayer: input.redGraphicsLayer,
    setXCoord: input.setXCoord,
    setYCoord: input.setYCoord,
    setLatitude: input.setLatitude,
    setLongitude: input.setLongitude,
    setCurrentPoint: input.setCurrentPoint,
  });
  input.logAction({
    message: "User clicked on map to add point",
    newData: { latitude: lat, longitude: lon },
  });
  if (input.step === 1) input.setStep(3);
}
