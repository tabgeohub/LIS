import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePathPointState } from "@helpers/ZustandStates/pathPointState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { parsePlanPath } from "./pathPlanUtils";
import { handlePathPointMapClick } from "./handlePathPointMapClick";

const MAX_CLICK_DISTANCE_M = 20;

export default function usePathPointHandlerClick() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedPathPoint } = usePathPointState();

  useEffect(() => {
    if (!mapView || !redGraphicsLayer || !selectedPlan) return;

    const planPath = parsePlanPath((selectedPlan as { path?: unknown }).path);
    if (planPath.length === 0) return;

    const map = mapView.map;
    if (!map) return;

    const handle = mapView.on("click", (event) => {
      if (!redGraphicsLayer || !event.mapPoint) return;

      handlePathPointMapClick({
        map,
        redGraphicsLayer,
        plan: selectedPlan,
        planPath,
        latitude: Number(event.mapPoint.latitude),
        longitude: Number(event.mapPoint.longitude),
        maxDistanceM: MAX_CLICK_DISTANCE_M,
        setSelectedPathPoint,
      });
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, selectedPlan, setSelectedPathPoint]);
}
