import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { EnrichedPointType } from "Types";
import {
  clearPointHoverGraphic,
  replacePointHoverGraphic,
} from "@helpers/ArcGISHelpers/pointHoverGraphics";

export default function usePointHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredPoint(point: EnrichedPointType | null | undefined) {
    if (!mapView || !point) return;

    replacePointHoverGraphic(mapView, point);
    setHovered({
      id: point.id,
      label: point.omschrijving ?? `Punt ${point.id}`,
      point,
    });
  }

  function handleRemoveHoverePoint() {
    if (!mapView) return;

    clearPointHoverGraphic(mapView);
    setHovered(null);
  }

  return {
    handleHoveredPoint,
    handleRemoveHoverePoint,
  };
}
