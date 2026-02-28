import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { getDistanceMeters } from "@helpers/getDistanceMeters";
import { EnrichedPointType } from "Types";

interface UseNearestPointClickOptions {
  points: EnrichedPointType[];
  onPointClick: (point: EnrichedPointType) => void;
  maxDistanceMeters?: number;
  enabled?: boolean;
}

/**
 * Hook that registers a map click handler to find and select the nearest point
 * to the clicked location within a specified maximum distance.
 */
export default function useNearestPointClick({
  points,
  onPointClick,
  maxDistanceMeters = 5000,
  enabled = true,
}: UseNearestPointClickOptions) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!enabled || !mapView || !redGraphicsLayer) return;

    const clickHandler = mapView.on("click", async (event) => {
      event.stopPropagation();

      const { mapPoint } = event;
      if (!mapPoint) return;

      const clickedLat = Number(mapPoint.latitude);
      const clickedLon = Number(mapPoint.longitude);

      // Find the nearest point to the clicked location
      let nearestPoint: EnrichedPointType | null = null;
      let minDistance = Infinity;

      // Check all points and find the nearest one
      for (const point of points) {
        if (!point.latitude || !point.longitude) continue;

        const distance = getDistanceMeters(
          point.latitude,
          point.longitude,
          clickedLat,
          clickedLon
        );

        // Always track the nearest point, but only select if within maximum distance
        if (distance < minDistance) {
          minDistance = distance;
          if (distance <= maxDistanceMeters) {
            nearestPoint = point;
          }
        }
      }

      // Select the nearest point if found within maximum distance
      if (nearestPoint) {
        onPointClick(nearestPoint);
      }
    });

    // Cleanup to prevent memory leaks
    return () => {
      clickHandler.remove();
    };
  }, [mapView, redGraphicsLayer, points, onPointClick, maxDistanceMeters, enabled]);
}

