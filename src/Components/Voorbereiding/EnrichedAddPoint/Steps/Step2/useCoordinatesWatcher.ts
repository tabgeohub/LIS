import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import { useCoordinateSystemSync } from "Components/HomePage/hooks/editPoint/useCoordinateSystemSync";
import { useEnrichedPointState } from "Components/Voorbereiding/EnrichedAddPoint/state/useEnrichedPointState";
import { pickEnrichedCoordinateControls } from "Components/Voorbereiding/EnrichedAddPoint/state/pickEnrichedCoordinateControls";

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
