import createPoint from "@helpers/ArcGISHelpers/createPoint";

export function createNewPoint(input: {
  redGraphicsLayer: __esri.GraphicsLayer;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  xCoord: number;
  yCoord: number;
}) {
  const pointGraphic = createPoint(input.xCoord, input.yCoord);

  input.setCurrentPoint({
    x: input.xCoord,
    y: input.yCoord,
  });

  input.redGraphicsLayer.add(pointGraphic);
}
