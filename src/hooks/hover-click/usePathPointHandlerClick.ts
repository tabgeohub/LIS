import { useEffect } from "react";
import { FinishedFlightPlanType } from "Types/finished_plans";
import type { PathPointType } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { usePathPointState } from "hooks/zustand/ui";
import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";
import { parsePlanPath, type PathPoint } from "./pathPlanUtils";
import { handlePathPointMapClick } from "./handlePathPointMapClick";

const MAX_CLICK_DISTANCE_M = 20;

function canAttachPathClick(input: {
  mapView: __esri.MapView | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  selectedPlan: unknown;
}): boolean {
  return !!input.mapView && !!input.redGraphicsLayer && !!input.selectedPlan;
}

function attachPathPointClickListener(input: {
  mapView: __esri.MapView;
  map: __esri.Map;
  redGraphicsLayer: __esri.GraphicsLayer;
  selectedPlan: FinishedFlightPlanType;
  planPath: PathPoint[];
  setSelectedPathPoint: (value: PathPointType | null) => void;
}): __esri.Handle {
  return input.mapView.on("click", (event) => {
    if (!event.mapPoint) return;
    handlePathPointMapClick({
      map: input.map,
      redGraphicsLayer: input.redGraphicsLayer,
      plan: input.selectedPlan,
      planPath: input.planPath,
      latitude: Number(event.mapPoint.latitude),
      longitude: Number(event.mapPoint.longitude),
      maxDistanceM: MAX_CLICK_DISTANCE_M,
      setSelectedPathPoint: input.setSelectedPathPoint,
    });
  });
}

export default function usePathPointHandlerClick() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedPathPoint } = usePathPointState();

  useEffect(() => {
    if (!canAttachPathClick({ mapView, redGraphicsLayer, selectedPlan })) {
      return;
    }

    const planPath = parsePlanPath((selectedPlan as { path?: unknown }).path);
    const map = mapView!.map;
    if (planPath.length === 0 || !map) return;

    const handle = attachPathPointClickListener({
      mapView: mapView!,
      map,
      redGraphicsLayer: redGraphicsLayer!,
      selectedPlan: selectedPlan!,
      planPath,
      setSelectedPathPoint,
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, selectedPlan, setSelectedPathPoint]);
}
