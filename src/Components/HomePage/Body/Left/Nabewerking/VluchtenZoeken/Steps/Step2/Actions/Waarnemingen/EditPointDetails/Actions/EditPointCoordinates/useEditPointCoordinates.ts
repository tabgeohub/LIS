import useLogAction from "hooks/useLogAction";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useUpdateData } from "utils/useUpdateData";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  useEditPointCoordinateInputs,
  useInitialEditPointMarker,
} from "./useEditPointCoordinateInputs";
import {
  useEditPointCleanup,
  useEditPointMapClick,
  useEditPointPreviewGraphics,
} from "./useEditPointMapEffects";
import { submitPointCoordinateUpdate } from "./submitPointCoordinates";

export function useEditPointCoordinates(setAction: (value: string) => void) {
  const logAction = useLogAction();
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
  } = useMapViewState();
  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  const inputs = useEditPointCoordinateInputs(selectedPoint);

  useInitialEditPointMarker({ selectedPoint, mapView, redGraphicsLayer });

  const clickHandleRef = useEditPointMapClick({
    mapView,
    redGraphicsLayer,
    coordinateSystem: inputs.coordinateSystem,
    setLongitude: inputs.setLongitude,
    setLatitude: inputs.setLatitude,
    setXCoordinaat_rd: inputs.setXCoordinaat_rd,
    setYCoordinaat_rd: inputs.setYCoordinaat_rd,
  });

  useEditPointPreviewGraphics({
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
    longitude: inputs.longitude,
    latitude: inputs.latitude,
  });

  useEditPointCleanup({
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
    originalCoordsRef: inputs.originalCoordsRef,
    clickHandleRef,
  });

  function handleSubmit() {
    if (!selectedPoint) return;
    submitPointCoordinateUpdate({
      selectedPoint,
      selectedPlan,
      coordinateSystem: inputs.coordinateSystem,
      longitude: inputs.longitude,
      latitude: inputs.latitude,
      xcoordinaat_rd: inputs.xcoordinaat_rd,
      ycoordinaat_rd: inputs.ycoordinaat_rd,
      update,
      setSelectedPoint,
      setSelectedPlan,
      mapView,
      pointsGraphicsLayer,
      yellowGraphicsLayer,
      redGraphicsLayer,
      setAction,
      logAction,
    });
  }

  return {
    selectedPoint,
    loading,
    coordinateSystem: inputs.coordinateSystem,
    setCoordinateSystem: inputs.setCoordinateSystem,
    xcoordinaat_rd: inputs.xcoordinaat_rd,
    setXCoordinaat_rd: inputs.setXCoordinaat_rd,
    ycoordinaat_rd: inputs.ycoordinaat_rd,
    setYCoordinaat_rd: inputs.setYCoordinaat_rd,
    longitude: inputs.longitude,
    setLongitude: inputs.setLongitude,
    latitude: inputs.latitude,
    setLatitude: inputs.setLatitude,
    handleSubmit,
  };
}
