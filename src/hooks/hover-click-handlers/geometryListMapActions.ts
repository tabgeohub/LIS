import {
  addStarGeometryGraphic,
  createHoverGeometryTableGraphic,
  goToGeometryCentroid,
  removeStarGeometryGraphic,
} from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import type { Geometry } from "hooks/features/useGeometriesStore";
import type { UseGeometryListMapActionsOptions } from "./useGeometryListMapActions";

export function createGeometryListMapActions(
  options: UseGeometryListMapActionsOptions,
  map: {
    graphicsLayerHover: __esri.GraphicsLayer | null;
    graphicsLayer: __esri.GraphicsLayer | null;
    mapView: __esri.MapView | null;
  }
) {
  return {
    hoverGeometry: (geometry: Geometry) => {
      if (!geometry.points?.length) return;
      const graphic = createHoverGeometryTableGraphic(geometry);
      if (graphic) map.graphicsLayerHover?.add(graphic);
    },
    clearHover: () => map.graphicsLayerHover?.removeAll(),
    goToGeometry: (geometry: Geometry) => {
      goToGeometryCentroid(map.mapView, geometry);
      options.onGoTo?.(geometry);
    },
    toggleStarGeometry: (geometry: Geometry) => {
      if (!map.graphicsLayer) return;
      if (options.starredGeometries.some((item) => item.id === geometry.id)) {
        options.setStarredGeometries((current) => current.filter((item) => item.id !== geometry.id));
        removeStarGeometryGraphic(geometry.id, map.graphicsLayer);
        options.onUnstar?.(geometry);
        return;
      }
      options.setStarredGeometries((current) => [...current, geometry]);
      if (!geometry.points?.length) return;
      addStarGeometryGraphic(geometry, map.graphicsLayer);
      options.onStar?.(geometry);
    },
  };
}
