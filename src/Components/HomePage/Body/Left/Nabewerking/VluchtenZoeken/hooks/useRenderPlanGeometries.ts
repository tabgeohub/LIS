/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { buildPlanGeometryGraphics } from "./buildPlanGeometryGraphics";

/**
 * Hook to render plan geometries on the map
 * Always renders plan geometries when in Step2, regardless of action
 */
export function useRenderPlanGeometries() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (
      !validateMapView(mapView, geometriesGraphicsLayer) ||
      !selectedPlan?.geometries
    ) {
      return;
    }

    replaceGraphics(
      geometriesGraphicsLayer,
      buildPlanGeometryGraphics(selectedPlan.geometries)
    );
  }, [selectedPlan?.geometries, mapView, geometriesGraphicsLayer]);
}
