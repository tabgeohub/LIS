import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import { EnrichedPointType } from "Types";
import { findNearestPoint } from "./nearestPoint";

interface UseNearestPointClickOptions {
  points: EnrichedPointType[];
  onPointClick: (point: EnrichedPointType) => void;
  maxDistanceMeters?: number;
  enabled?: boolean;
}

function handleNearestPointClick(input: {
  event: __esri.ViewClickEvent;
  points: EnrichedPointType[];
  onPointClick: (point: EnrichedPointType) => void;
  maxDistanceMeters: number;
}) {
  input.event.stopPropagation();
  const { mapPoint } = input.event;
  if (!mapPoint) return;

  const nearestPoint = findNearestPoint({
    points: input.points,
    latitude: Number(mapPoint.latitude),
    longitude: Number(mapPoint.longitude),
    maxDistanceMeters: input.maxDistanceMeters,
  });
  if (nearestPoint) input.onPointClick(nearestPoint);
}

function resolveMapClickContext(input: {
  enabled: boolean;
  mapView: __esri.MapView | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  if (!input.enabled || !input.mapView || !input.redGraphicsLayer) return null;
  return {
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
  };
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
    const ctx = resolveMapClickContext({ enabled, mapView, redGraphicsLayer });
    if (!ctx) return;

    const clickHandler = ctx.mapView.on("click", (event) => {
      handleNearestPointClick({ event, points, onPointClick, maxDistanceMeters });
    });

    return () => {
      clickHandler.remove();
    };
  }, [mapView, redGraphicsLayer, points, onPointClick, maxDistanceMeters, enabled]);
}
