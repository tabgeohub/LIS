import type useLogAction from "hooks/useLogAction";

export type EditPointMapClickInput = {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  coordinateSystem: string;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
};

/** Shared input for map-click coordinate apply helpers. */
export type ApplyEditPointMapClickInput = {
  event: __esri.ViewClickEvent;
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
  coordinateSystem: string;
  setters: Pick<
    EditPointMapClickInput,
    | "setLongitude"
    | "setLatitude"
    | "setXCoordinaat_rd"
    | "setYCoordinaat_rd"
  >;
  logAction: ReturnType<typeof useLogAction>;
};
