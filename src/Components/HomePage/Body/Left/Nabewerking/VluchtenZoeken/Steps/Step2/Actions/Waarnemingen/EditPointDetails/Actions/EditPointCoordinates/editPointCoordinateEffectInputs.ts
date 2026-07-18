import type { EditPointCoordinateEffectsInput } from "./editPointCoordinateEffectsTypes";

export function toInitialEditPointMarkerInput(
  input: EditPointCoordinateEffectsInput
) {
  return {
    selectedPoint: input.selectedPoint,
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
  };
}

export function toEditPointMapClickInput(
  input: EditPointCoordinateEffectsInput
) {
  return {
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    coordinateSystem: input.coordinateSystem,
    setLongitude: input.setLongitude,
    setLatitude: input.setLatitude,
    setXCoordinaat_rd: input.setXCoordinaat_rd,
    setYCoordinaat_rd: input.setYCoordinaat_rd,
  };
}

export function toEditPointPreviewGraphicsInput(
  input: EditPointCoordinateEffectsInput
) {
  return {
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    selectedPoint: input.selectedPoint,
    longitude: input.longitude,
    latitude: input.latitude,
  };
}

export function toEditPointCleanupInput(
  input: EditPointCoordinateEffectsInput
) {
  return {
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    selectedPoint: input.selectedPoint,
    originalCoordsRef: input.originalCoordsRef,
  };
}
