import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type {
  CoordinateSyncPatch,
  CoordinateSyncPatchInput,
} from "./coordinateSyncPatchTypes";

export function buildRdCoordinateSyncPatch(
  input: CoordinateSyncPatchInput
): CoordinateSyncPatch {
  const transformed = getTransformedCoordinates({
    fromProjection: "RD",
    toProjection: "WGS84",
    x: input.rdX,
    y: input.rdY,
  });
  return { longitude: transformed.x, latitude: transformed.y };
}
