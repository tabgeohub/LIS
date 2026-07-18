import { getDistanceInMeters } from "../../helpers/getDistanceInMeters";
import type { EnrichedPointType } from "Types";

export function isNearExistingPoint(
  lon: number,
  lat: number,
  points: EnrichedPointType[]
) {
  return points.some(
    (p) =>
      getDistanceInMeters({
        from: { lat, lon },
        to: { lat: p.latitude, lon: p.longitude },
      }) < 50
  );
}
