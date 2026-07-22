import { parseFinite } from "./coords";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { PointFormState } from "../helpers/pointForm";

type Wgs84Coords = { longitude: number; latitude: number };

function readDirectWgs84(form: PointFormState): Wgs84Coords | null {
  const lon = parseFinite(form.longitude);
  const lat = parseFinite(form.latitude);
  if (lon == null || lat == null) return null;
  return { longitude: lon, latitude: lat };
}

function transformRdToWgs84(form: PointFormState): Wgs84Coords | null {
  const x = parseFinite(form.xcoordinaat_rd);
  const y = parseFinite(form.ycoordinaat_rd);
  if (x == null || y == null) return null;

  const transformed = getTransformedCoordinates({
    fromProjection: "RD",
    toProjection: "WGS84",
    x,
    y,
  });

  if (!Number.isFinite(transformed.x) || !Number.isFinite(transformed.y)) {
    return null;
  }

  return { longitude: transformed.x, latitude: transformed.y };
}

export function resolveDebouncedPointWgs84(form: PointFormState) {
  return readDirectWgs84(form) ?? transformRdToWgs84(form);
}
