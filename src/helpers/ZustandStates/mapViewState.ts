import { create } from "zustand";
import { createMapViewClearGraphics } from "./mapViewClearGraphics";
import { createMapViewCoreSlice } from "./mapViewCoreSlice";
import { createMapViewLayersSlice } from "./mapViewLayersSlice";
import type { MapViewState } from "./mapViewStateTypes";

export const useMapViewState = create<MapViewState>((set, get) => ({
  ...createMapViewCoreSlice(set),
  ...createMapViewLayersSlice(set),
  clearGraphics: createMapViewClearGraphics(get),
}));
