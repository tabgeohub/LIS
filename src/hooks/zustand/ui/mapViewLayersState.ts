export type MapViewLayersState = {
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
  yellowGeometriesGraphicsLayer: __esri.GraphicsLayer | null;
  setYellowGeometriesGraphicsLayer: (
    yellowGeometriesGraphicsLayer: __esri.GraphicsLayer
  ) => void;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setRedGraphicsLayer: (redGraphicsLayer: __esri.GraphicsLayer) => void;
  selectedPointGraphicsLayer: __esri.GraphicsLayer | null;
  setSelectedPointGraphicsLayer: (
    selectedPointGraphicsLayer: __esri.GraphicsLayer | null
  ) => void;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null;
  setGeometriesGraphicsLayer: (
    geometriesGraphicsLayer: __esri.GraphicsLayer | null
  ) => void;
};
