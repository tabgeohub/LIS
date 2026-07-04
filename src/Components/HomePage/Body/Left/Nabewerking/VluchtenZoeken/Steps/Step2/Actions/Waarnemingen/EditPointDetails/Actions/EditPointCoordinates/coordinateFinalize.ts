import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export type CoordinateValues = {
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
};

export function finalizeCoordinateValues(
  coordinateSystem: string,
  values: CoordinateValues
): CoordinateValues {
  if (coordinateSystem === "RD") {
    const transformed = getTransformedCoordinates({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: values.xcoordinaat_rd,
      y: values.ycoordinaat_rd,
    });
    return {
      ...values,
      longitude: transformed.x,
      latitude: transformed.y,
    };
  }

  if (coordinateSystem === "WGS84") {
    const transformed = getTransformedCoordinates({
      fromProjection: "WGS84",
      toProjection: "RD",
      x: values.longitude,
      y: values.latitude,
    });
    return {
      ...values,
      xcoordinaat_rd: transformed.x,
      ycoordinaat_rd: transformed.y,
    };
  }

  return values;
}

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
