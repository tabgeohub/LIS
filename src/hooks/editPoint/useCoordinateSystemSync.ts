/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import {
  applyCoordinateSystemSync,
  type CoordinateSystemSyncInput,
} from "./applyCoordinateSystemSync";

export type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";

export function useCoordinateSystemSync(input: CoordinateSystemSyncInput) {
  const { coordinateSystem, rdX, rdY, latitude, longitude, patchCoords } = input;

  useEffect(() => {
    applyCoordinateSystemSync(input);
  }, [coordinateSystem, rdX, rdY, latitude, longitude, patchCoords]);
}
