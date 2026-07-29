import { EnrichedPointType } from "Types";
import type { NewPointCoordSetters } from "@helpers/ArcGISHelpers/newPointEventCoords";
import { handleEnrichedAddPointClick } from "./handleEnrichedAddPointClick";

export type MapClickInput = NewPointCoordSetters & {
  step: number;
  points: EnrichedPointType[];
  mapClickedNotify: number;
  nearPointToast: string;
  setMapClickedNotify: (value: number) => void;
  setStep: (value: number) => void;
};

export function registerEnrichedAddPointClick(input: {
  mapView: __esri.MapView | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer;
  clickInput: MapClickInput;
  logAction: (args: { message: string; newData?: unknown }) => void;
}): __esri.Handle | undefined {
  const { mapView, redGraphicsLayer, clickInput, logAction } = input;
  if (!(clickInput.step === 1 || clickInput.step === 2) || !mapView) {
    return undefined;
  }
  return mapView.on("click", async (event) => {
    handleEnrichedAddPointClick({
      event,
      ...clickInput,
      redGraphicsLayer,
      logAction,
    });
  });
}
