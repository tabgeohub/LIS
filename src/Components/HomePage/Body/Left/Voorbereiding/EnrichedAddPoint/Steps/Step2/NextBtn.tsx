import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import React from "react";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { applyGraphicPositionNext } from "./applyGraphicPositionNext";

export default function NextBtn() {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { points } = usePointsStore();
  const content = useContent();
  const {
    xCoord,
    yCoord,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setStep,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();
  const logAction = useLogAction();

  const graphicPosition = () => {
    if (!mapView || !longitude || !latitude) return;
    applyGraphicPositionNext({
      longitude,
      latitude,
      points,
      warning: content.voorbereiding.aandachtspuntAanmaken.step3.warning,
      redGraphicsLayer,
      setXCoord,
      setYCoord,
      setLongitude,
      setLatitude,
      setStep,
      logAction,
    });
  };

  return (
    <button
      onClick={graphicPosition}
      disabled={xCoord === 0 && yCoord === 0}
      className="gray-button"
    >
      {content.common.volgende}
    </button>
  );
}
