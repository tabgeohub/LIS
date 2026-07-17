/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import useLogAction from "hooks/useLogAction";
import { handleEnrichedAddPointClick } from "./handleEnrichedAddPointClick";

export function useEnrichedAddPointMapClick(input: {
  step: number;
  points: EnrichedPointType[];
  mapClickedNotify: number;
  nearPointToast: string;
  setMapClickedNotify: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setStep: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((input.step === 1 || input.step === 2) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        handleEnrichedAddPointClick({
          event,
          points: input.points,
          nearPointToast: input.nearPointToast,
          mapClickedNotify: input.mapClickedNotify,
          step: input.step,
          redGraphicsLayer,
          setMapClickedNotify: input.setMapClickedNotify,
          setXCoord: input.setXCoord,
          setYCoord: input.setYCoord,
          setLatitude: input.setLatitude,
          setLongitude: input.setLongitude,
          setCurrentPoint: input.setCurrentPoint,
          setStep: input.setStep,
          logAction,
        });
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.step, input.mapClickedNotify, input.points]);
}
