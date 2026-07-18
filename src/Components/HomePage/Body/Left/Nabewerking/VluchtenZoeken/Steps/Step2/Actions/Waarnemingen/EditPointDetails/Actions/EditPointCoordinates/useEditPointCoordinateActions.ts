import { useEditPointCoordinateEffectsFromStores } from "./useEditPointCoordinateEffectsFromStores";
import { useEditPointCoordinateSubmit } from "./useEditPointCoordinateSubmit";
import type { useEditPointCoordinateStores } from "./useEditPointCoordinateStores";

type Stores = ReturnType<typeof useEditPointCoordinateStores>;

export function useEditPointCoordinateActions(
  setAction: (value: string) => void,
  s: Stores
) {
  useEditPointCoordinateEffectsFromStores(s);
  return useEditPointCoordinateSubmit({
    setAction,
    selectedPoint: s.selectedPoint,
    selectedPlan: s.selectedPlan,
    setSelectedPoint: s.setSelectedPoint,
    setSelectedPlan: s.setSelectedPlan,
    mapView: s.mapView,
    pointsGraphicsLayer: s.pointsGraphicsLayer,
    yellowGraphicsLayer: s.yellowGraphicsLayer,
    redGraphicsLayer: s.redGraphicsLayer,
    values: s.inputs,
  });
}
