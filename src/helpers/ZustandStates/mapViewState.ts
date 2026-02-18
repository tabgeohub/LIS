import { create } from "zustand";
import Search from "@arcgis/core/widgets/Search";

interface RegionData {
  [key: string]: {
    [attr: string]: any;
    rings: number[][][];
  }[];
}

export const useMapViewState = create<{
  mapView: __esri.MapView | null;
  setMapView: (mapView: __esri.MapView) => void;

  map: __esri.Map | null;
  setMap: (map: __esri.Map) => void;

  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  setPointsGraphicsLayer: (pointsGraphicsLayer: __esri.GraphicsLayer) => void;

  graphicsLayer: __esri.GraphicsLayer | null;
  setGraphicsLayer: (graphicsLayer: __esri.GraphicsLayer | null) => void;

  graphicsLayerHover: __esri.GraphicsLayer | null;
  setGraphicsLayerHover: (
    graphicsLayerHover: __esri.GraphicsLayer | null
  ) => void;

  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  setYellowGraphicsLayer: (yellowGraphicsLayer: __esri.GraphicsLayer) => void;

  redGraphicsLayer: __esri.GraphicsLayer | null;
  setRedGraphicsLayer: (redGraphicsLayer: __esri.GraphicsLayer) => void;

  searchWidget: Search | null;
  setSearchWidget: (searchWidget: Search) => void;

  topMessage: {
    message: string;
    show: boolean;
  };
  setTopMessage: (value: { message: string; show: boolean }) => void;

  regios: RegionData;
  setRegios: (regios: RegionData) => void;

  selectedPointGraphicsLayer: __esri.GraphicsLayer | null;
  setSelectedPointGraphicsLayer: (
    selectedPointGraphicsLayer: __esri.GraphicsLayer | null
  ) => void;

  geometriesGraphicsLayer: __esri.GraphicsLayer | null;
  setGeometriesGraphicsLayer: (
    geometriesGraphicsLayer: __esri.GraphicsLayer | null
  ) => void;

  clearGraphics: () => void;
}>((set, get) => ({
  mapView: null,
  setMapView: (mapView: __esri.MapView) => set({ mapView }),

  map: null,
  setMap: (map: __esri.Map) => set({ map }),

  pointsGraphicsLayer: null,
  setPointsGraphicsLayer: (pointsGraphicsLayer: __esri.GraphicsLayer) =>
    set({ pointsGraphicsLayer }),

  graphicsLayer: null,
  setGraphicsLayer: (graphicsLayer: __esri.GraphicsLayer | null) =>
    set({ graphicsLayer }),

  graphicsLayerHover: null,
  setGraphicsLayerHover: (graphicsLayerHover: __esri.GraphicsLayer | null) =>
    set({ graphicsLayerHover }),

  yellowGraphicsLayer: null,
  setYellowGraphicsLayer: (yellowGraphicsLayer: __esri.GraphicsLayer) =>
    set({ yellowGraphicsLayer }),

  searchWidget: null,
  setSearchWidget: (searchWidget) => set({ searchWidget }),

  redGraphicsLayer: null,
  setRedGraphicsLayer: (redGraphicsLayer: __esri.GraphicsLayer) =>
    set({ redGraphicsLayer }),

  selectedPointGraphicsLayer: null,
  setSelectedPointGraphicsLayer: (
    selectedPointGraphicsLayer: __esri.GraphicsLayer | null
  ) => set({ selectedPointGraphicsLayer }),

  geometriesGraphicsLayer: null,
  setGeometriesGraphicsLayer: (
    geometriesGraphicsLayer: __esri.GraphicsLayer | null
  ) => set({ geometriesGraphicsLayer }),

  topMessage: {
    message: "",
    show: false,
  },
  setTopMessage: (value: { message: string; show: boolean }) =>
    set({ topMessage: value }),

  regios: {},
  setRegios: (regios: RegionData) => set({ regios }),

  clearGraphics: () => {
    const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer } = get();

    // geometriesGraphicsLayer is not cleared - geometries persist
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    yellowGraphicsLayer?.removeAll();
  },
}));
