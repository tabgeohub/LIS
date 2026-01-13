import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
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
      if (coordinateSystem === "RD") {
        const { x: transformedX, y: transformedY } = getTransformedCoordinates(
          "RD",
          "WGS84",
          xCoord,
          yCoord
        );

        setLongitude(transformedX);
        setLatitude(transformedY);
      } else if (coordinateSystem === "WGS84") {
        const { x: transformedX, y: transformedY } = getTransformedCoordinates(
          "WGS84",
          "RD",
          longitude,
          latitude
        );

        setXCoord(transformedX);
        setYCoord(transformedY);
      }

      redGraphicsLayer.removeAll();

      createNewPoint(redGraphicsLayer, setCurrentPoint, longitude, latitude);

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
