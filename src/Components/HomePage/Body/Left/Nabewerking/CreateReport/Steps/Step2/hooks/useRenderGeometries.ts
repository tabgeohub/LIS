import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import useLogAction from "hooks/useLogAction";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { buildPlanGeometryGraphics } from "./buildPlanGeometryGraphics";

export function useRenderGeometries(
  selectedPlan: FinishedFlightPlanType | null,
  selectedGeometries: number[]
) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!validateMapView(mapView, geometriesGraphicsLayer) || !selectedPlan) return;

    const graphics = buildPlanGeometryGraphics(selectedPlan, selectedGeometries);
    replaceGraphics(geometriesGraphicsLayer, graphics);

    logAction({
      message: "User selected geometries",
      step: "First step",
      newData: { geometries: selectedGeometries },
    });
  }, [
    selectedGeometries,
    mapView,
    selectedPlan,
    geometriesGraphicsLayer,
    logAction,
  ]);
}
