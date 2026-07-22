import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { CoordinateValues } from "./coordinateValues";

export function coordsFromMapClick(input: {
  coordinateSystem: string;
  clickedLon: number;
  clickedLat: number;
}): CoordinateValues {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.clickedLon,
    y: input.clickedLat,
  });

  return {
    longitude: input.clickedLon,
    latitude: input.clickedLat,
    xcoordinaat_rd: transformed.x,
    ycoordinaat_rd: transformed.y,
  };
}
