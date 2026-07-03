import { getPointCoordinates } from "./createPointGraphic";

type PathPoint = {
  longitude?: number;
  latitude?: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
};

export function geometryPathFromPoints(
  points: PathPoint[] | undefined
): [number, number][] {
  return (points || [])
    .map((point) => getPointCoordinates(point, true))
    .filter(
      (coords): coords is { longitude: number; latitude: number } =>
        coords != null
    )
    .map((coords) => [coords.longitude, coords.latitude] as [number, number]);
}

export function closePolygonRing(
  ring: [number, number][]
): [number, number][] {
  const [firstX, firstY] = ring[0];
  const [lastX, lastY] = ring[ring.length - 1];
  if (firstX !== lastX || firstY !== lastY) {
    return [...ring, [firstX, firstY]];
  }
  return ring;
}

export function isPolygonGeometryType(geometryType: string | undefined): boolean {
  return (geometryType || "").toLowerCase().includes("polygon");
}
