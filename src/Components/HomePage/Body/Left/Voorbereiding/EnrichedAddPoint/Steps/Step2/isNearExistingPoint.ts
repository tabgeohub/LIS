import { getDistanceInMeters } from "../../helpers/getDistanceInMeters";
import type { EnrichedPointType } from "Types";

export function isNearExistingPoint(input: {
  lon: number;
  lat: number;
  points: EnrichedPointType[];
}) {
  return input.points.some(
    (p) =>
      getDistanceInMeters({
        from: { lat: input.lat, lon: input.lon },
        to: { lat: p.latitude, lon: p.longitude },
      }) < 50
  );
}
