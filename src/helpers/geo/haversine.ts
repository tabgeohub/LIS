import { getDistanceMeters, type GeoCoord } from "./getDistanceMeters";

/** Alias kept for call sites that still import `haversine`. */
export function haversine(input: { from: GeoCoord; to: GeoCoord }): number {
  return getDistanceMeters(input);
}

export type { GeoCoord };
