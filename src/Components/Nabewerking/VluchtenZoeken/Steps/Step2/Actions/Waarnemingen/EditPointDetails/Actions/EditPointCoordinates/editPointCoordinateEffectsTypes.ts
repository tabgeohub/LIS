import type { MutableRefObject } from "react";
import type { FinishedPointType } from "Types/finished_plans";

export type EditPointCoordinateEffectsInput = {
  selectedPoint: FinishedPointType | null;
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
  originalCoordsRef: MutableRefObject<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>;
};
