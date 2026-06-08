import {
  addStarGeometryGraphic,
  createHoverGeometryTableGraphic,
  goToGeometryCentroid,
  removeStarGeometryGraphic,
} from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry } from "hooks/features/useGeometriesStore";
import { Dispatch, SetStateAction } from "react";

export interface UseGeometryListMapActionsOptions {
  starredGeometries: Geometry[];
  setStarredGeometries: Dispatch<SetStateAction<Geometry[]>>;
  onStar?: (geometry: Geometry) => void;
  onUnstar?: (geometry: Geometry) => void;
  onGoTo?: (geometry: Geometry) => void;
}

export default function useGeometryListMapActions({
  starredGeometries,
  setStarredGeometries,
  onStar,
  onUnstar,
  onGoTo,
}: UseGeometryListMapActionsOptions) {
  const { graphicsLayerHover, graphicsLayer, mapView } = useMapViewState();

  const hoverGeometry = (geometry: Geometry) => {
    if (!geometry.points || geometry.points.length === 0) return;

    const graphic = createHoverGeometryTableGraphic(geometry);
    if (graphic) {
      graphicsLayerHover?.add(graphic);
    }
  };

  const clearHover = () => {
    graphicsLayerHover?.removeAll();
  };

  const goToGeometry = (geometry: Geometry) => {
    goToGeometryCentroid(mapView, geometry);
    onGoTo?.(geometry);
  };

  const toggleStarGeometry = (geometry: Geometry) => {
    if (!graphicsLayer) return;

    const alreadyStarred = starredGeometries.find((g) => g.id === geometry.id);

    if (alreadyStarred) {
      setStarredGeometries((prev) => prev.filter((g) => g.id !== geometry.id));
      removeStarGeometryGraphic(geometry.id, graphicsLayer);
      onUnstar?.(geometry);
    } else {
      setStarredGeometries((prev) => [...prev, geometry]);

      if (!geometry.points || geometry.points.length === 0) return;

      addStarGeometryGraphic(geometry, graphicsLayer);
      onStar?.(geometry);
    }
  };

  return {
    hoverGeometry,
    clearHover,
    goToGeometry,
    toggleStarGeometry,
  };
}
