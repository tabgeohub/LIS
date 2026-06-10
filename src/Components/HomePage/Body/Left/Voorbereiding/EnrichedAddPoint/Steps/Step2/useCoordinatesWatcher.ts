import { useCoordinateSystemSync } from "hooks/editPoint/useCoordinateSystemSync";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";

export default function useCoordinatesWatcher() {
  const {
    xCoord,
    yCoord,
    coordinateSystem,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();

  useCoordinateSystemSync({
    coordinateSystem,
    rdX: xCoord,
    rdY: yCoord,
    latitude,
    longitude,
    patchCoords: (patch) => {
      if (patch.longitude !== undefined) setLongitude(patch.longitude);
      if (patch.latitude !== undefined) setLatitude(patch.latitude);
      if (patch.rdX !== undefined) setXCoord(patch.rdX);
      if (patch.rdY !== undefined) setYCoord(patch.rdY);
    },
  });
}
