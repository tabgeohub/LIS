import toast from "react-hot-toast";
import { createNewPointEvent } from "Components/HomePage/helpers/ArcGISHelpers/createNewPointEvent";
import type { NewPointCoordSetters } from "Components/HomePage/helpers/ArcGISHelpers/newPointEventCoords";
import { isNearExistingPoint } from "./Steps/Step2/isNearExistingPoint";

export type EnrichedAddPointClickInput = NewPointCoordSetters & {
  event: __esri.ViewClickEvent;
  points: import("Types").EnrichedPointType[];
  nearPointToast: string;
  mapClickedNotify: number;
  step: number;
  redGraphicsLayer: __esri.GraphicsLayer;
  setMapClickedNotify: (value: number) => void;
  setStep: (value: number) => void;
  logAction: (input: { message: string; newData?: unknown }) => void;
};

export function handleEnrichedAddPointClick(
  input: EnrichedAddPointClickInput
): void {
  const lon = input.event.mapPoint.longitude;
  const lat = input.event.mapPoint.latitude;
  if (!lon || !lat) return;

  if (isNearExistingPoint({ lon, lat, points: input.points })) {
    toast.error(input.nearPointToast);
    return;
  }

  input.setMapClickedNotify(input.mapClickedNotify + 1);
  createNewPointEvent(input);
  input.logAction({
    message: "User clicked on map to add point",
    newData: { latitude: lat, longitude: lon },
  });
  if (input.step === 1) input.setStep(3);
}
