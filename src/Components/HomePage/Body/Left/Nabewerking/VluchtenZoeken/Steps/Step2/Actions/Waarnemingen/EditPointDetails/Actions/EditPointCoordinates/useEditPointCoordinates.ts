import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEditPointCoordinateInputs } from "./useEditPointCoordinateInputs";
import { useEditPointCoordinateEffects } from "./useEditPointCoordinateEffects";
import { useEditPointCoordinateSubmit } from "./useEditPointCoordinateSubmit";
import { toEditPointCoordinatesView } from "./toEditPointCoordinatesView";

export function useEditPointCoordinates(setAction: (value: string) => void) {
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
  } = useMapViewState();

  const inputs = useEditPointCoordinateInputs(selectedPoint);

  useEditPointCoordinateEffects({
    selectedPoint,
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    coordinateSystem: inputs.coordinateSystem,
    longitude: inputs.longitude,
    latitude: inputs.latitude,
    setLongitude: inputs.setLongitude,
    setLatitude: inputs.setLatitude,
    setXCoordinaat_rd: inputs.setXCoordinaat_rd,
    setYCoordinaat_rd: inputs.setYCoordinaat_rd,
    originalCoordsRef: inputs.originalCoordsRef,
  });

  const { loading, handleSubmit } = useEditPointCoordinateSubmit({
    setAction,
    selectedPoint,
    selectedPlan,
    setSelectedPoint,
    setSelectedPlan,
    mapView,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
    redGraphicsLayer,
    values: inputs,
  });

  return toEditPointCoordinatesView({
    selectedPoint,
    loading,
    inputs,
    handleSubmit,
  });
}
