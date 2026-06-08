import {
  addStarPointGraphic,
  createPointHoverGraphic,
  goToEnrichedPoint,
  removeStarPointGraphics,
  starAllPointsOnMap,
} from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Dispatch, SetStateAction } from "react";
import { EnrichedPointType } from "Types";

export interface UsePointListMapActionsOptions {
  starredPoints: EnrichedPointType[];
  setStarredPoints: Dispatch<SetStateAction<EnrichedPointType[]>>;
  onStar?: (point: EnrichedPointType) => void;
  onUnstar?: (point: EnrichedPointType) => void;
  onGoTo?: (point: EnrichedPointType) => void;
}

export default function usePointListMapActions({
  starredPoints,
  setStarredPoints,
  onStar,
  onUnstar,
  onGoTo,
}: UsePointListMapActionsOptions) {
  const { graphicsLayerHover, graphicsLayer, mapView } = useMapViewState();

  const hoverPoint = (point: EnrichedPointType) => {
    graphicsLayerHover?.add(createPointHoverGraphic(point));
  };

  const clearHover = () => {
    graphicsLayerHover?.removeAll();
  };

  const goToPoint = (point: EnrichedPointType) => {
    goToEnrichedPoint(mapView, point);
    onGoTo?.(point);
  };

  const toggleStarPoint = (point: EnrichedPointType) => {
    if (!graphicsLayer) return;

    const alreadyStarred = starredPoints.find((p) => p.id === point.id);

    if (alreadyStarred) {
      setStarredPoints((prev) => prev.filter((p) => p.id !== point.id));
      removeStarPointGraphics(point.id, graphicsLayer);
      onUnstar?.(point);
    } else {
      setStarredPoints((prev) => [...prev, point]);
      addStarPointGraphic(point, graphicsLayer);
      onStar?.(point);
    }
  };

  const starAllPoints = (points: EnrichedPointType[]) => {
    starAllPointsOnMap({
      points,
      starredPoints,
      setStarredPoints,
      graphicsLayer,
    });
  };

  return {
    hoverPoint,
    clearHover,
    goToPoint,
    toggleStarPoint,
    starAllPoints,
  };
}
