import proj4 from "proj4";

export type TransformCoordinatesInput = {
  fromProjection: "RD" | "WGS84";
  toProjection: "RD" | "WGS84";
  x: number;
  y: number;
};

const PROJECTION_EPSG: Record<"RD" | "WGS84", string> = {
  RD: "EPSG:28992",
  WGS84: "EPSG:4326",
};

function hasFiniteCoordinates(x: number, y: number): boolean {
  return isFinite(x) && isFinite(y);
}

export function getTransformedCoordinates(input: TransformCoordinatesInput) {
  const { fromProjection, toProjection, x, y } = input;
  const from = PROJECTION_EPSG[fromProjection];
  const to = PROJECTION_EPSG[toProjection];

  if (!hasFiniteCoordinates(x, y)) {
    return { x, y };
  }

  const [newX, newY] = proj4(from, to, [x, y]);
  return { x: newX, y: newY };
}
