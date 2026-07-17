/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { handleAddPointStepMapClick } from "./handleAddPointStepMapClick";

export function useAddPointStepMapClick(input: {
  addPointStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setAddPointStep: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((input.addPointStep === 2 || input.addPointStep === 1) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        handleAddPointStepMapClick({
          event,
          redGraphicsLayer,
          addPointStep: input.addPointStep,
          mapClickedNotify: input.mapClickedNotify,
          setMapClickedNotify: input.setMapClickedNotify,
          setCurrentPoint: input.setCurrentPoint,
          setXCoord: input.setXCoord,
          setYCoord: input.setYCoord,
          setLatitude: input.setLatitude,
          setLongitude: input.setLongitude,
          setAddPointStep: input.setAddPointStep,
        });
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.addPointStep, input.mapClickedNotify]);
}
