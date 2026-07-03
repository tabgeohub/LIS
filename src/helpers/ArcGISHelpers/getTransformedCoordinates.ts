import proj4 from "proj4";

export type TransformCoordinatesInput = {
  fromProjection: "RD" | "WGS84";
  toProjection: "RD" | "WGS84";
  x: number;
  y: number;
};

export function getTransformedCoordinates(input: TransformCoordinatesInput) {
  const { fromProjection, toProjection, x, y } = input;

  let from;
  let to;

  if (fromProjection === "RD") {
    from = "EPSG:28992";
  } else if (fromProjection === "WGS84") {
    from = "EPSG:4326";
  }

  if (toProjection === "RD") {
    to = "EPSG:28992";
  } else if (toProjection === "WGS84") {
    to = "EPSG:4326";
  }

  if (isFinite(x) && isFinite(y)) {
    const [newX, newY] = proj4(from!, to!, [x, y]);
    return { x: newX, y: newY };
  }

  return { x, y };
}
