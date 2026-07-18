/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { handleAddPointStepMapClick } from "./handleAddPointStepMapClick";
import type { AddPointStepMapClickState } from "./addPointStepMapClickTypes";

export function useAddPointStepMapClick(input: AddPointStepMapClickState) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((input.addPointStep === 2 || input.addPointStep === 1) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        handleAddPointStepMapClick({
          event,
          redGraphicsLayer,
          ...input,
        });
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.addPointStep, input.mapClickedNotify]);
}
