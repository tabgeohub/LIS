import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { FinishedPointType } from "Types/finished_plans";

export function usePointHandlers() {
  const { mapView } = useMapViewState();

  function handleHoveredPoint(point: FinishedPointType) {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    createPin(point, mapView!, "hovered-point");
  }

  function handleRemoveHoveredPoint() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));
  }

  return {
    handleHoveredPoint,
    handleRemoveHoveredPoint,
  };
}



