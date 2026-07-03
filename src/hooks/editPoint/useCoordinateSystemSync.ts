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
        getTransformedCoordinates({ fromProjection: "RD", toProjection: "WGS84", x: rdX, y: rdY });

      patchCoords({
        longitude: transformedLongitude,
        latitude: transformedLatitude,
      });
    } else if (coordinateSystem === "WGS84") {
      const { x: transformedRdX, y: transformedRdY } = getTransformedCoordinates({ fromProjection: "WGS84", toProjection: "RD", x: longitude, y: latitude
       });

      patchCoords({
        rdX: transformedRdX,
        rdY: transformedRdY,
      });
    }
  }, [coordinateSystem, rdX, rdY, latitude, longitude]);
}
