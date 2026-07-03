import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePathPointState } from "@helpers/ZustandStates/pathPointState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import {
  findNearestPathPoint,
  parsePlanPath,
} from "./pathPlanUtils";
import {
  addSelectedPathHighlight,
  clearSelectedPathHighlights,
} from "./pathPointGraphics";

const MAX_CLICK_DISTANCE_M = 20;

export default function usePathPointHandlerClick() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedPathPoint } = usePathPointState();

  useEffect(() => {
    if (!mapView || !redGraphicsLayer || !selectedPlan) return;

    const planPath = parsePlanPath((selectedPlan as { path?: unknown }).path);
    if (planPath.length === 0) return;

    const handle = mapView.on("click", (event) => {
      if (!redGraphicsLayer || !event.mapPoint) return;

      mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);

      const nearest = findNearestPathPoint({
        planPath,
        latitude: Number(event.mapPoint.latitude),
        longitude: Number(event.mapPoint.longitude),
        maxDistanceM: MAX_CLICK_DISTANCE_M,
      });

      if (!nearest) {
        setSelectedPathPoint(null);
        clearSelectedPathHighlights(redGraphicsLayer);
        return;
      }

      setSelectedPathPoint({
        longitude: nearest.longitude,
        latitude: nearest.latitude,
        altitude: nearest.altitude ?? 0,
        speed: nearest.speed ?? 0,
        rotationAngle: nearest.rotationAngle ?? 0,
        planId: String((selectedPlan as { id?: number }).id ?? ""),
        vluchtnummer: (selectedPlan as { vluchtnummer?: string }).vluchtnummer ?? "",
      });

      addSelectedPathHighlight(redGraphicsLayer, nearest);
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, selectedPlan, setSelectedPathPoint]);
}
