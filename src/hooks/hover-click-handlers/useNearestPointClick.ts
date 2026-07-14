import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import { findNearestPoint } from "./nearestPoint";

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

      const nearestPoint = findNearestPoint({
        points,
        latitude: Number(mapPoint.latitude),
        longitude: Number(mapPoint.longitude),
        maxDistanceMeters,
      });
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

