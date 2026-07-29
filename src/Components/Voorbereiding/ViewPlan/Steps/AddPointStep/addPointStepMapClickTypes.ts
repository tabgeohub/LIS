export type { NewPointCoordSetters as AddPointStepCoordinateSetters } from "@helpers/ArcGISHelpers/newPointEventCoords";
import type { NewPointCoordSetters } from "@helpers/ArcGISHelpers/newPointEventCoords";

export type AddPointStepMapClickState = NewPointCoordSetters & {
  addPointStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setAddPointStep: (value: number) => void;
};
