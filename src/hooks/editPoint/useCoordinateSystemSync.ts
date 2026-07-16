/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { SpatialReference } from "Types";
import {
  buildCoordinateSyncPatch,
  type CoordinateSyncPatch,
} from "@helpers/geo/buildCoordinateSyncPatch";

export type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";

export function useCoordinateSystemSync({
  coordinateSystem,
  rdX,
  rdY,
  latitude,
  longitude,
  patchCoords,
}: {
  coordinateSystem: SpatialReference | string;
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
  patchCoords: (patch: CoordinateSyncPatch) => void;
}) {
  useEffect(() => {
    const patch = buildCoordinateSyncPatch({
      coordinateSystem,
      rdX,
      rdY,
      latitude,
      longitude,
    });
    if (patch) patchCoords(patch);
  }, [coordinateSystem, rdX, rdY, latitude, longitude]);
}
