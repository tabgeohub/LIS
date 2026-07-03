import { parseFinite } from "./coords";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { PointFormState } from "../helpers/pointForm";

export function resolveDebouncedPointWgs84(form: PointFormState) {
  const lon = parseFinite(form.longitude);
  const lat = parseFinite(form.latitude);
  if (lon != null && lat != null) return { longitude: lon, latitude: lat };

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
