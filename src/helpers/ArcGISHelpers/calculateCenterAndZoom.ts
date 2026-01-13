import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";

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
  if (maxDistance < 160) return 8; // Country-wide

  return 7; // Continental or global scale
}

export function calculateCenterAndZoom(
  points: EnrichedPointType[] | FinishedPointType[]
): {
  center: { latitude: number; longitude: number };
  zoom: number;
} {
  let sumLat = 0;
  let sumLon = 0;
  const numPoints = points.length;

  points.forEach((point) => {
    sumLat += point.latitude;
    sumLon += point.longitude;
  });

  const centerLat = sumLat / numPoints;
  const centerLon = sumLon / numPoints;

  let maxDistance = 0;
  points.forEach((point) => {
    points.forEach((otherPoint) => {
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
