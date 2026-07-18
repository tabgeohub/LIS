import { createMapViewBaseLayersSlice } from "./mapViewBaseLayersSlice";
import { createMapViewExtraLayersSlice } from "./mapViewExtraLayersSlice";
import type { MapViewState } from "./mapViewStateTypes";

export function createMapViewLayersSlice(
  set: (partial: Partial<MapViewState>) => void
) {
  return {
    ...createMapViewBaseLayersSlice(set),
    ...createMapViewExtraLayersSlice(set),
  };
}
