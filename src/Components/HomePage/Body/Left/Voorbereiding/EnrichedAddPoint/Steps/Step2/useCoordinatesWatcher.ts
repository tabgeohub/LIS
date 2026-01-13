/* eslint-disable react-hooks/exhaustive-deps */
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { useEffect } from "react";

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

  useEffect(() => {
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
  }, [xCoord, yCoord, coordinateSystem, longitude, latitude]);
}
