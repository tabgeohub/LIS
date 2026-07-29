/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { createEditPointClickHandler } from "./editPointMapClickHelpers";

export function useEditPointFormMapClick<T extends Record<string, unknown>>(input: {
  subStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setValues: (values: T, shouldValidate?: boolean) => unknown;
  values: T;
}) {
  const logAction = useLogAction();
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (input.subStep !== 1 || !mapView) return;
    const handle = mapView.on(
      "click",
      createEditPointClickHandler({
        ...input,
        mapView,
        redGraphicsLayer,
        logAction,
      })
    );
    return () => handle.remove();
  }, [
    input.subStep,
    input.mapClickedNotify,
    mapView,
    redGraphicsLayer,
    input.setValues,
    input.values,
  ]);
}
