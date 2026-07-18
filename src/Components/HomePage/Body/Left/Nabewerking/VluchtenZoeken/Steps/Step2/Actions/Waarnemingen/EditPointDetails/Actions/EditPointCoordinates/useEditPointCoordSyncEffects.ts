import { useEffect } from "react";
import type { FinishedPointType } from "Types/finished_plans";
import {
  applyCoordinateSystemPatch,
  applySelectedPointCoords,
} from "./editPointCoordinateApply";
import type { useEditPointCoordState } from "./useEditPointCoordState";

type CoordState = ReturnType<typeof useEditPointCoordState>;

export function useSyncEditPointFromSelection(
  selectedPoint: FinishedPointType | null,
  state: CoordState
) {
  const {
    setLongitude,
    setLatitude,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    originalCoordsRef,
  } = state;
  useEffect(() => {
    if (!selectedPoint) return;
    originalCoordsRef.current = applySelectedPointCoords({
      selectedPoint,
      setLongitude,
      setLatitude,
      setXCoordinaat_rd,
      setYCoordinaat_rd,
    });
  }, [
    selectedPoint,
    setLongitude,
    setLatitude,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    originalCoordsRef,
  ]);
}

export function useSyncEditPointCoordinateSystem(
  selectedPoint: FinishedPointType | null,
  state: CoordState
) {
  useEffect(() => {
    if (!selectedPoint) return;
    applyCoordinateSystemPatch({
      coordinateSystem: state.coordinateSystem,
      longitude: state.longitude,
      latitude: state.latitude,
      xcoordinaat_rd: state.xcoordinaat_rd,
      ycoordinaat_rd: state.ycoordinaat_rd,
      setLongitude: state.setLongitude,
      setLatitude: state.setLatitude,
      setXCoordinaat_rd: state.setXCoordinaat_rd,
      setYCoordinaat_rd: state.setYCoordinaat_rd,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.coordinateSystem]);
}
