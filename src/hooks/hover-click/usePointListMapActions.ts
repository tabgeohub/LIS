import { useMapViewState } from "hooks/zustand/ui";
import { Dispatch, SetStateAction } from "react";
import { EnrichedPointType } from "Types";
import { createPointListMapActions } from "./pointListMapActions";

export interface UsePointListMapActionsOptions {
  starredPoints: EnrichedPointType[];
  setStarredPoints: Dispatch<SetStateAction<EnrichedPointType[]>>;
  onStar?: (point: EnrichedPointType) => void;
  onUnstar?: (point: EnrichedPointType) => void;
  onGoTo?: (point: EnrichedPointType) => void;
}

export default function usePointListMapActions(options: UsePointListMapActionsOptions) {
  const { graphicsLayerHover, graphicsLayer, mapView } = useMapViewState();
  return createPointListMapActions(options, { graphicsLayerHover, graphicsLayer, mapView });
}
