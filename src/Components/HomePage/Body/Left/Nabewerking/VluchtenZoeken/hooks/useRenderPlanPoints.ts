/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "Components/HomePage/helpers/ArcGISHelpers/replaceGraphics";

/**
 * Hook to render plan points on the map
 * Always renders plan points when in Step2, regardless of action
 */
export function useRenderPlanPoints() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!validateMapView(mapView, pointsGraphicsLayer) || !selectedPlan?.points_data) return;

    const graphics = createPointGraphics(selectedPlan.points_data.filter((p) => p !== null), {
      symbolOptions: {
        color: "blue",
        size: 12,
        style: "circle",
        outlineColor: "white",
        outlineWidth: 1,
      },
      transformCoordinates: true,
    });

    replaceGraphics(pointsGraphicsLayer, graphics);
  }, [selectedPlan?.points_data, mapView, pointsGraphicsLayer]);
}

