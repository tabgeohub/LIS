import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useMapViewState } from "hooks/zustand/ui";
import { useEditPointCoordinateInputs } from "./useEditPointCoordinateInputs";

export function useEditPointCoordinateStores() {
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
  } = useMapViewState();
  const inputs = useEditPointCoordinateInputs(selectedPoint);
  return {
    selectedPoint,
    selectedPlan,
    setSelectedPlan,
    setSelectedPoint,
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
    inputs,
  };
}
