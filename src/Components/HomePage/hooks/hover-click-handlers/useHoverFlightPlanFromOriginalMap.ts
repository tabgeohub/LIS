import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { FlightPlanType } from "Types";
import { createHoverFlightPlanFromOriginalMap } from "./showPlanSearchListHover";

/** Table/list hover handler bound to current map layers + original graphics map. */
export function useHoverFlightPlanFromOriginalMap(originalGraphicsMap: {
  current: Map<number, __esri.Graphic> | Map<string, __esri.Graphic>;
}): (plan: FlightPlanType) => void {
  const { mapView, graphicsLayerHover, graphicsLayer } = useMapViewState();
  return createHoverFlightPlanFromOriginalMap({
    mapView,
    graphicsLayerHover,
    graphicsLayer,
    originalGraphicsMap,
  });
}
