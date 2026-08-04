import { useEffect, useRef } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import { usePointsStore } from "hooks/features";
import { attachDeletePointMapClick } from "./attachDeletePointMapClick";

export function useDeletePointMapSelection() {
  const { points } = usePointsStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const { setSelectedPoints } = useDeletePointState();
  const pointsRef = useRef(points);
  const setSelectedPointsRef = useRef(setSelectedPoints);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    setSelectedPointsRef.current = setSelectedPoints;
  }, [setSelectedPoints]);

  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer) return;
    return attachDeletePointMapClick({
      mapView,
      pointsGraphicsLayer,
      getPoints: () => pointsRef.current,
      setSelectedPoints: (next) => setSelectedPointsRef.current(next),
    });
  }, [mapView, pointsGraphicsLayer]);
}
