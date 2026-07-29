import { getDistanceMeters, type GeoCoord } from "./getDistanceMeters";

export function haversine(input: { from: GeoCoord; to: GeoCoord }): number {
  return getDistanceMeters(input);
}
