/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";

/**
 * Hook to render plan points on the map
 * Always renders plan points when in Step2, regardless of action
 */
export function useRenderPlanPoints() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer || !selectedPlan?.points_data) return;

    pointsGraphicsLayer.removeAll();

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

    if (graphics.length > 0) {
      pointsGraphicsLayer.addMany(graphics);
    }
  }, [selectedPlan?.points_data, mapView, pointsGraphicsLayer]);
}

