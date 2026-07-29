import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import { useCoordinateSystemSync } from "Components/HomePage/hooks/editPoint/useCoordinateSystemSync";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { pickEnrichedCoordinateControls } from "hooks/zustand/pickEnrichedCoordinateControls";

export default function useCoordinatesWatcher() {
  const coords = pickEnrichedCoordinateControls(useEnrichedPointState());

  useCoordinateSystemSync({
    coordinateSystem: coords.coordinateSystem,
    rdX: coords.xCoord,
    rdY: coords.yCoord,
    latitude: coords.latitude,
    longitude: coords.longitude,
    patchCoords: (patch) => applyCoordinateSyncPatchToSetters(patch, coords),
  });
}
