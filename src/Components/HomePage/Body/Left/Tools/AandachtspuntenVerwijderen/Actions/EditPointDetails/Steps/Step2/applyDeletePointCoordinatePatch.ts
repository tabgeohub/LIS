import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";

export function applyDeletePointCoordinatePatch(input: {
  coordinateSystem: string;
  patch: CoordinateSyncPatch;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
}): void {
  const {
    coordinateSystem,
    patch,
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    setLatitude,
    setLongitude,
  } = input;

  if (coordinateSystem === "RD") {
    if (patch.latitude !== undefined) setLatitude(patch.latitude);
    if (patch.longitude !== undefined) setLongitude(patch.longitude);
    setXCoordinaat_rd(xcoordinaat_rd);
    setYCoordinaat_rd(ycoordinaat_rd);
    return;
  }

  if (coordinateSystem === "WGS84") {
    if (patch.rdX !== undefined) setXCoordinaat_rd(patch.rdX);
    if (patch.rdY !== undefined) setYCoordinaat_rd(patch.rdY);
    setLatitude(latitude);
    setLongitude(longitude);
  }
}
