import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { Geometry } from "hooks/features/useGeometriesStore";
import { Dispatch, SetStateAction } from "react";
import { createGeometryListMapActions } from "./geometryListMapActions";

export interface UseGeometryListMapActionsOptions {
  starredGeometries: Geometry[];
  setStarredGeometries: Dispatch<SetStateAction<Geometry[]>>;
  onStar?: (geometry: Geometry) => void;
  onUnstar?: (geometry: Geometry) => void;
  onGoTo?: (geometry: Geometry) => void;
}

export default function useGeometryListMapActions(options: UseGeometryListMapActionsOptions) {
  const { graphicsLayerHover, graphicsLayer, mapView } = useMapViewState();
  return createGeometryListMapActions(options, { graphicsLayerHover, graphicsLayer, mapView });
}
