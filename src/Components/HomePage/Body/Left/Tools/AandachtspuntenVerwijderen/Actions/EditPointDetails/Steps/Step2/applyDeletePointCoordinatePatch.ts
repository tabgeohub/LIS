import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export function applyDeletePointCoordinatePatch(input: {
  coordinateSystem: string;
  patch: CoordinateSyncPatch;
}): void {
  const {
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    setLatitude,
    setLongitude,
  } = useDeletePointState.getState();

  const setters = {
    setLongitude,
    setLatitude,
    setXCoord: setXCoordinaat_rd,
    setYCoord: setYCoordinaat_rd,
  };

  if (input.coordinateSystem === "RD") {
    applyCoordinateSyncPatchToSetters(
      {
        latitude: input.patch.latitude,
        longitude: input.patch.longitude,
      },
      setters
    );
    setXCoordinaat_rd(xcoordinaat_rd);
    setYCoordinaat_rd(ycoordinaat_rd);
    return;
  }

  if (input.coordinateSystem === "WGS84") {
    applyCoordinateSyncPatchToSetters(
      {
        rdX: input.patch.rdX,
        rdY: input.patch.rdY,
      },
      setters
    );
    setLatitude(latitude);
    setLongitude(longitude);
  }
}
