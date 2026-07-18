import type Search from "@arcgis/core/widgets/Search";
import type { RegionData } from "./mapViewRegionData";

export type MapViewCoreState = {
  mapView: __esri.MapView | null;
  setMapView: (mapView: __esri.MapView) => void;
  map: __esri.Map | null;
  setMap: (map: __esri.Map) => void;
  searchWidget: Search | null;
  setSearchWidget: (searchWidget: Search) => void;
  topMessage: { message: string; show: boolean };
  setTopMessage: (value: { message: string; show: boolean }) => void;
  regios: RegionData;
  setRegios: (regios: RegionData) => void;
  clearGraphics: () => void;
};
