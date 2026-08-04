import createPoint from "@helpers/ArcGISHelpers/createPoint";

export type CreateNewPointInput = {
  redGraphicsLayer: __esri.GraphicsLayer;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  xCoord: number;
  yCoord: number;
};

export function createNewPoint(input: CreateNewPointInput) {
  input.setCurrentPoint({ x: input.xCoord, y: input.yCoord });
  input.redGraphicsLayer.add(createPoint(input.xCoord, input.yCoord));
}
