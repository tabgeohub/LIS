import { useEffect, useRef } from "react";
import {
  applyCoordinateSystemSync,
  type CoordinateSystemSyncInput,
} from "./applyCoordinateSystemSync";

export type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";

export function useCoordinateSystemSync(input: CoordinateSystemSyncInput) {
  const { coordinateSystem, rdX, rdY, latitude, longitude } = input;
  const sourceX = coordinateSystem === "RD" ? rdX : longitude;
  const sourceY = coordinateSystem === "RD" ? rdY : latitude;
  const latestInput = useRef(input);

  useEffect(() => {
    latestInput.current = input;
  }, [input]);

  useEffect(() => {
    applyCoordinateSystemSync(latestInput.current);
  }, [coordinateSystem, sourceX, sourceY]);
}
