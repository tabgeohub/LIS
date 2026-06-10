/* eslint-disable react-hooks/exhaustive-deps */
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useEffect } from "react";
import { SpatialReference } from "Types";

export type CoordinateSyncPatch = {
  rdX?: number;
  rdY?: number;
  latitude?: number;
  longitude?: number;
};

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
    if (coordinateSystem === "RD") {
      const { x: transformedLongitude, y: transformedLatitude } =
        getTransformedCoordinates("RD", "WGS84", rdX, rdY);

      patchCoords({
        longitude: transformedLongitude,
        latitude: transformedLatitude,
      });
    } else if (coordinateSystem === "WGS84") {
      const { x: transformedRdX, y: transformedRdY } = getTransformedCoordinates(
        "WGS84",
        "RD",
        longitude,
        latitude
      );

      patchCoords({
        rdX: transformedRdX,
        rdY: transformedRdY,
      });
    }
  }, [coordinateSystem, rdX, rdY, latitude, longitude]);
}
