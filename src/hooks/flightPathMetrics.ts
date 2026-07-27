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

type PathCoordinate = { latitude: number; longitude: number };

function calculatePathTotalDistance(path: unknown): number | null {
  if (!Array.isArray(path) || path.length < 2) return null;
  return (path as PathCoordinate[]).slice(1).reduce((sum, point, index) => {
    const previous = path[index] as PathCoordinate;
    return (
      sum +
      haversine({
        from: { lat: previous.latitude, lon: previous.longitude },
        to: { lat: point.latitude, lon: point.longitude },
      })
    );
  }, 0);
}

function extractSortedFlightStartTimes(flighttime: unknown): number[] {
  if (!Array.isArray(flighttime)) return [];
  return flighttime
    .filter((item) => item.action === "start")
    .map((item) => item.time)
    .sort();
}

function buildFlightTimeMetrics(starts: number[]): Omit<FlightPathMetrics, "totalDistance"> {
  const begin = starts[0];
  const end = starts[starts.length - 1];
  return {
    beginTime: new Date(begin).toLocaleString(),
    endTime: new Date(end).toLocaleString(),
    durationSeconds: Math.round((end - begin) / 1000 / 60),
  };
}

export function calculateFlightPathMetrics(row?: PlanPathRow): FlightPathMetrics {
  if (!row) return EMPTY_FLIGHT_PATH_METRICS;

  const totalDistance = calculatePathTotalDistance(row.path);
  const starts = extractSortedFlightStartTimes(row.flighttime);
  if (starts.length === 0) {
    return { ...EMPTY_FLIGHT_PATH_METRICS, totalDistance };
  }

  return { ...buildFlightTimeMetrics(starts), totalDistance };
}
