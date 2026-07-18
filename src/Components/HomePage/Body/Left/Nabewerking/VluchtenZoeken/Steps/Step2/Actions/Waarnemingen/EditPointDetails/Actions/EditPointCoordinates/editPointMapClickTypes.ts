export type EditPointMapClickInput = {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  coordinateSystem: string;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
};
