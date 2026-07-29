/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import {
  handleDeletePointEmptyMapClick,
  type DeletePointCoordSetter,
} from "./handleDeletePointEmptyMapClick";

export function useDeletePointMapClick(input: {
  subStep: number;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setCoords: DeletePointCoordSetter;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (input.subStep !== 1 || !mapView || !redGraphicsLayer) return;

    const handle = mapView.on("click", async (event) => {
      await handleDeletePointEmptyMapClick({
        event,
        mapView,
        redGraphicsLayer,
        currentPoint: input.currentPoint,
        setCurrentPoint: input.setCurrentPoint,
        setCoords: input.setCoords,
      });
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, input.subStep, input.currentPoint.x, input.currentPoint.y]);
}
