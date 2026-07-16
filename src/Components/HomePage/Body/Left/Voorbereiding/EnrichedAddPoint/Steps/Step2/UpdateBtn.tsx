import { buildCoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { createNewPoint } from "../../helpers/createNewPoint";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function UpdateBtn() {
  const { redGraphicsLayer } = useMapViewState();

  const {
    xCoord,
    yCoord,
    coordinateSystem,
    setCurrentPoint,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();

  const logAction = useLogAction();

  const content = useContent();

  function handleUpdate() {
    if (redGraphicsLayer) {
      const patch = buildCoordinateSyncPatch({
        coordinateSystem,
        rdX: xCoord,
        rdY: yCoord,
        latitude,
        longitude,
      });
      if (patch?.longitude !== undefined) setLongitude(patch.longitude);
      if (patch?.latitude !== undefined) setLatitude(patch.latitude);
      if (patch?.rdX !== undefined) setXCoord(patch.rdX);
      if (patch?.rdY !== undefined) setYCoord(patch.rdY);

      redGraphicsLayer.removeAll();

      createNewPoint({
        redGraphicsLayer,
        setCurrentPoint,
        xCoord: longitude,
        yCoord: latitude,
      });

      logAction({
        message: "User clicked 'Update' button",
        step: "Second step",
        newData: {
          latitude: latitude,
          longitude: longitude,
        },
      });
    }
  }

  return (
    <button onClick={handleUpdate} className="gray-button">
      {content.common.update}
    </button>
  );
}
