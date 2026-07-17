type Coordinate = { latitude: number; longitude: number };

export const DEFAULT_MAP_VIEW = {
  center: { latitude: 52.1326, longitude: 5.2913 },
  zoom: 8,
};

export const ZOOM_THRESHOLDS = [
  { maxDistance: 1, zoom: 15 },
  { maxDistance: 2, zoom: 14 },
  { maxDistance: 5, zoom: 13 },
  { maxDistance: 10, zoom: 12 },
  { maxDistance: 20, zoom: 11 },
  { maxDistance: 40, zoom: 10 },
  { maxDistance: 80, zoom: 9 },
  { maxDistance: 190, zoom: 8 },
] as const;

export function isFiniteCoordinate(
  point: Coordinate | null | undefined
): point is Coordinate {
  return Boolean(
    point &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude)
  );
}

export function averageCoordinates(points: Coordinate[]): Coordinate {
  const totals = points.reduce(
    (sum, point) => ({
      latitude: sum.latitude + point.latitude,
      longitude: sum.longitude + point.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );
  return {
    latitude: totals.latitude / points.length,
    longitude: totals.longitude / points.length,
  };
}

function haversineDistance(input: {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
}): number {
  const R = 6371;
  const dLat = ((input.to.lat - input.from.lat) * Math.PI) / 180;
  const dLon = ((input.to.lon - input.from.lon) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((input.from.lat * Math.PI) / 180) *
      Math.cos((input.to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateZoom(maxDistance: number): number {
  return (
    ZOOM_THRESHOLDS.find(
      ({ maxDistance: threshold }) => maxDistance < threshold
    )?.zoom ?? 7
  );
}

export function maximumDistanceFromCenter(
  points: Coordinate[],
  center: Coordinate
): number {
  return points.reduce(
    (maximum, point) =>
      Math.max(
        maximum,
        haversineDistance({
          from: { lat: center.latitude, lon: center.longitude },
          to: { lat: point.latitude, lon: point.longitude },
        })
      ),
    0
  );
}

export function calculateCenterAndZoomFromPoints(
  points: Array<{ latitude: number; longitude: number }>
): {
  center: { latitude: number; longitude: number };
  zoom: number;
} {
  const valid = points.filter(isFiniteCoordinate);

  if (valid.length === 0) {
    return DEFAULT_MAP_VIEW;
  }

  const center = averageCoordinates(valid);
  const maxDistance = maximumDistanceFromCenter(valid, center);

  return {
    center,
    zoom: calculateZoom(maxDistance * 2),
  };
}
