import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type {
  CoordinateSyncPatch,
  CoordinateSyncPatchInput,
} from "./coordinateSyncPatchTypes";

export function buildWgs84CoordinateSyncPatch(
  input: CoordinateSyncPatchInput
): CoordinateSyncPatch {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.longitude,
    y: input.latitude,
  });
  return { rdX: transformed.x, rdY: transformed.y };
}
