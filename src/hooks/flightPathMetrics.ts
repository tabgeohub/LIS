import { haversine } from "@helpers/haversine";
import type { PlanPathRow } from "api-hooks/finishedPlans";

export type FlightPathMetrics = {
  beginTime: string | null;
  endTime: string | null;
  durationSeconds: number | null;
  totalDistance: number | null;
};

export const EMPTY_FLIGHT_PATH_METRICS: FlightPathMetrics = {
  beginTime: null,
  endTime: null,
  durationSeconds: null,
  totalDistance: null,
};

export function calculateFlightPathMetrics(row?: PlanPathRow): FlightPathMetrics {
  if (!row) return EMPTY_FLIGHT_PATH_METRICS;
  const path = row.path;
  let totalDistance: number | null = null;
  if (Array.isArray(path) && path.length >= 2) {
    totalDistance = path.slice(1).reduce((sum, point, index) =>
      sum + haversine({
        from: { lat: path[index].latitude, lon: path[index].longitude },
        to: { lat: point.latitude, lon: point.longitude },
      }), 0);
  }
  const starts = Array.isArray(row.flighttime)
    ? row.flighttime.filter((item) => item.action === "start").map((item) => item.time).sort()
    : [];
  if (starts.length === 0) return { ...EMPTY_FLIGHT_PATH_METRICS, totalDistance };
  const begin = starts[0];
  const end = starts[starts.length - 1];
  return {
    beginTime: new Date(begin).toLocaleString(),
    endTime: new Date(end).toLocaleString(),
    durationSeconds: Math.round((end - begin) / 1000 / 60),
    totalDistance,
  };
}
