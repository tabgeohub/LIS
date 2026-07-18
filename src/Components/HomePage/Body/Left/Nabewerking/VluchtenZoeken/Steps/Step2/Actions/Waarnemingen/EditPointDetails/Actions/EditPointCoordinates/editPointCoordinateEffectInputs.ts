import type { EditPointCoordinateEffectsInput } from "./editPointCoordinateEffectsTypes";

function pickEditPointMapLayers(input: EditPointCoordinateEffectsInput) {
  return {
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    selectedPoint: input.selectedPoint,
  };
}

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
    ...pickEditPointMapLayers(input),
    longitude: input.longitude,
    latitude: input.latitude,
  };
}

export function toEditPointCleanupInput(
  input: EditPointCoordinateEffectsInput
) {
  return {
    ...pickEditPointMapLayers(input),
    originalCoordsRef: input.originalCoordsRef,
  };
}
