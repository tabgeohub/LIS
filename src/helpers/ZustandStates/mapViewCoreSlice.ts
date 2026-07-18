import type { MapViewState } from "./mapViewStateTypes";

export function createMapViewCoreSlice(
  set: (partial: Partial<MapViewState>) => void
) {
  return {
    mapView: null as __esri.MapView | null,
    setMapView: (mapView: __esri.MapView) => set({ mapView }),
    map: null as __esri.Map | null,
    setMap: (map: __esri.Map) => set({ map }),
    searchWidget: null as MapViewState["searchWidget"],
    setSearchWidget: (searchWidget: MapViewState["searchWidget"]) =>
      set({ searchWidget }),
    topMessage: { message: "", show: false },
    setTopMessage: (value: { message: string; show: boolean }) =>
      set({ topMessage: value }),
    regios: {} as MapViewState["regios"],
    setRegios: (regios: MapViewState["regios"]) => set({ regios }),
  };
}
