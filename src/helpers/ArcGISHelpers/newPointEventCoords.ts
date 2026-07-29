import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export type NewPointClickCoords = {
  longitude: number;
  latitude: number;
  rdX: number;
  rdY: number;
};

export function resolveNewPointClickCoords(
  mapPoint: __esri.Point | null | undefined
): NewPointClickCoords | null {
  if (!mapPoint?.longitude || !mapPoint?.latitude) return null;

  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: mapPoint.longitude,
    y: mapPoint.latitude,
  });

  return {
    longitude: mapPoint.longitude,
    latitude: mapPoint.latitude,
    rdX: transformed.x,
    rdY: transformed.y,
  };
}

export type NewPointCoordSetters = {
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
};

export function applyNewPointClickCoords(
  coords: NewPointClickCoords,
  setters: NewPointCoordSetters
) {
  setters.setXCoord(coords.rdX);
  setters.setYCoord(coords.rdY);
  setters.setCurrentPoint({ x: coords.rdX, y: coords.rdY });
  setters.setLongitude(coords.longitude);
  setters.setLatitude(coords.latitude);
}

export function addNewPointClickGraphic(
  layer: __esri.GraphicsLayer,
  coords: NewPointClickCoords
) {
  layer.removeAll();
  layer.add(createPoint(coords.longitude, coords.latitude));
}
