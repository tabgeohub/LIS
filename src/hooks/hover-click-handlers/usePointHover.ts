import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { EnrichedPointType } from "Types";

export default function usePointHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredPoint(point: EnrichedPointType | null | undefined) {
    if (!mapView || !point) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    createPin(point, mapView!, "hovered-point");
    setHovered({
      id: point.id,
      label: point.omschrijving ?? `Punt ${point.id}`,
      point,
    });
  }

  function handleRemoveHoverePoint() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    setHovered(null);
  }

  return {
    handleHoveredPoint,
    handleRemoveHoverePoint,
  };
}
