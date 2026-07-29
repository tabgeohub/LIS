import { useEditPointCoordinateEffects } from "./useEditPointCoordinateEffects";
import type { useEditPointCoordinateStores } from "./useEditPointCoordinateStores";

type Stores = ReturnType<typeof useEditPointCoordinateStores>;

export function useEditPointCoordinateEffectsFromStores(s: Stores) {
  useEditPointCoordinateEffects({
    selectedPoint: s.selectedPoint,
    mapView: s.mapView,
    redGraphicsLayer: s.redGraphicsLayer,
    pointsGraphicsLayer: s.pointsGraphicsLayer,
    coordinateSystem: s.inputs.coordinateSystem,
    longitude: s.inputs.longitude,
    latitude: s.inputs.latitude,
    setLongitude: s.inputs.setLongitude,
    setLatitude: s.inputs.setLatitude,
    setXCoordinaat_rd: s.inputs.setXCoordinaat_rd,
    setYCoordinaat_rd: s.inputs.setYCoordinaat_rd,
    originalCoordsRef: s.inputs.originalCoordsRef,
  });
}
