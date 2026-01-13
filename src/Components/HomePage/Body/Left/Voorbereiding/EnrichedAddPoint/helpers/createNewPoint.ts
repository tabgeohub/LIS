import createPoint from "@helpers/ArcGISHelpers/createPoint";

export function createNewPoint(
  redGraphicsLayer: __esri.GraphicsLayer,
  setCurrentPoint: (value: { x: number; y: number }) => void,
  xCoord: number,
  yCoord: number
) {
  const pointGraphic = createPoint(xCoord, yCoord);

  setCurrentPoint({
    x: xCoord,
    y: yCoord,
  });

  redGraphicsLayer.add(pointGraphic);
}
