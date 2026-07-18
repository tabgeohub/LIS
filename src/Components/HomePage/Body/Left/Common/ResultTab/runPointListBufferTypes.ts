type BufferPoint = {
  id: number;
  latitude: number;
  longitude: number;
};

export type RunPointListBufferInput = {
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  pointsTable: BufferPoint[];
  distance: number;
  unit: "kilometers" | "meters";
  spatialReference?: __esri.SpatialReference;
  setFase: (value: string) => void;
  logAction: (input: { message: string; step: string }) => void;
};
