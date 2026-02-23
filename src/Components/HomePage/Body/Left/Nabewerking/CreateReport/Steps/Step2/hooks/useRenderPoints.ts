import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { FinishedFlightPlanType } from "Types/finished_plans";
import useLogAction from "hooks/useLogAction";

export function useRenderPoints(
  selectedPlan: FinishedFlightPlanType | null,
  selectedPoints: number[]
) {
  const { mapView } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!mapView || !selectedPlan) return;

    // Clear only point graphics (not geometry graphics)
    const graphicsArray = mapView.graphics.toArray();
    graphicsArray
      .filter(
        (graphic) =>
          graphic.attributes?.label !== "hovered-geometry" &&
          graphic.attributes?.label !== "hovered-point"
      )
      .forEach((graphic) => mapView.graphics.remove(graphic));

    if (selectedPoints.length > 0) {
      selectedPlan.points_data
        .filter((point) => selectedPoints.includes(point.id))
        .forEach((point) => {
          createPin(point, mapView);
        });
    }

    logAction({
      message: "User selected points",
      step: "First step",
      newData: {
        points: selectedPoints,
      },
    });
  }, [selectedPoints, mapView, selectedPlan, logAction]);
}



