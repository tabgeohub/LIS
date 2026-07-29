import {
  addStarPointGraphic,
  createPointHoverGraphic,
  goToEnrichedPoint,
  removeStarPointGraphics,
  starAllPointsOnMap,
} from "Components/HomePage/helpers/ArcGISHelpers/createPointMapGraphics";
import { EnrichedPointType } from "Types";
import type { UsePointListMapActionsOptions } from "./usePointListMapActions";

export function createPointListMapActions(
  options: UsePointListMapActionsOptions,
  map: {
    graphicsLayerHover: __esri.GraphicsLayer | null;
    graphicsLayer: __esri.GraphicsLayer | null;
    mapView: __esri.MapView | null;
  }
) {
  return {
    hoverPoint: (point: EnrichedPointType) => map.graphicsLayerHover?.add(createPointHoverGraphic(point)),
    clearHover: () => map.graphicsLayerHover?.removeAll(),
    goToPoint: (point: EnrichedPointType) => {
      goToEnrichedPoint(map.mapView, point);
      options.onGoTo?.(point);
    },
    toggleStarPoint: (point: EnrichedPointType) => {
      if (!map.graphicsLayer) return;
      if (options.starredPoints.some((item) => item.id === point.id)) {
        options.setStarredPoints((current) => current.filter((item) => item.id !== point.id));
        removeStarPointGraphics(point.id, map.graphicsLayer);
        options.onUnstar?.(point);
      } else {
        options.setStarredPoints((current) => [...current, point]);
        addStarPointGraphic(point, map.graphicsLayer);
        options.onStar?.(point);
      }
    },
    starAllPoints: (points: EnrichedPointType[]) => starAllPointsOnMap({
      points,
      starredPoints: options.starredPoints,
      setStarredPoints: options.setStarredPoints,
      graphicsLayer: map.graphicsLayer,
    }),
  };
}
