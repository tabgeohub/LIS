/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import {
  registerEnrichedAddPointClick,
  type MapClickInput,
} from "./registerEnrichedAddPointClick";

export function useEnrichedAddPointMapClick(input: MapClickInput) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!redGraphicsLayer) return;
    const clickHandle = registerEnrichedAddPointClick({
      mapView,
      redGraphicsLayer,
      clickInput: input,
      logAction,
    });
    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.step, input.mapClickedNotify, input.points]);
}
