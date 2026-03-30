import {
  FinishedFlightPlanType,
  FinishedGeometryType,
} from "Types/finished_plans";

export function geometryCentroid(
  g: FinishedGeometryType
): { lat: number; lon: number } | null {
  if (!g.points?.length) return null;
  let sumLat = 0;
  let sumLon = 0;
  let n = 0;
  for (const p of g.points) {
    if (
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude)
    ) {
      sumLat += p.latitude;
      sumLon += p.longitude;
      n++;
    }
  }
  if (n === 0) return null;
  return { lat: sumLat / n, lon: sumLon / n };
}

/** All standalone points plus one centroid per geometry (for map extent / center). */
export function collectPointsForCenterAndZoom(
  plan: FinishedFlightPlanType | null | undefined
): { latitude: number; longitude: number }[] {
  if (!plan) return [];

  const out: { latitude: number; longitude: number }[] = [];
  const pointsData = Array.isArray(plan.points_data) ? plan.points_data : [];
  for (const p of pointsData) {
    if (
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude)
    ) {
      out.push({ latitude: p.latitude, longitude: p.longitude });
    }
  }

  const geometries = Array.isArray(plan.geometries) ? plan.geometries : [];
  for (const g of geometries) {
    if (!g) continue;
    const c = geometryCentroid(g);
    if (c && Number.isFinite(c.lat) && Number.isFinite(c.lon)) {
      out.push({ latitude: c.lat, longitude: c.lon });
    }
  }

  return out;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function calculateZoom(maxDistance: number): number {
  if (maxDistance < 1) return 15; // Very close points
  if (maxDistance < 2) return 14; // Close points
  if (maxDistance < 5) return 13; // Moderate distance
  if (maxDistance < 10) return 12; // City-wide
  if (maxDistance < 20) return 11; // City to regional
  if (maxDistance < 40) return 10; // Regional
  if (maxDistance < 80) return 9; // Larger regional
  if (maxDistance < 190) return 8; // Country-wide

  return 7; // Continental or global scale
}

export function calculateCenterAndZoom(
  points: Array<{ latitude: number; longitude: number }>
): {
  center: { latitude: number; longitude: number };
  zoom: number;
} {
  const valid = points.filter(
    (p) =>
      p != null && Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
  );

  if (valid.length === 0) {
    return {
      center: { latitude: 52.1326, longitude: 5.2913 },
      zoom: 8,
    };
  }

  let sumLat = 0;
  let sumLon = 0;
  const numPoints = valid.length;

  valid.forEach((point) => {
    sumLat += point.latitude;
    sumLon += point.longitude;
  });

  const centerLat = sumLat / numPoints;
  const centerLon = sumLon / numPoints;

  let maxDistance = 0;
  valid.forEach((point) => {
    valid.forEach((otherPoint) => {
      const distance = haversineDistance(
        point.latitude,
        point.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    });
  });

  let zoom = calculateZoom(maxDistance);

  return {
    center: { latitude: centerLat, longitude: centerLon },
    zoom,
  };
}
