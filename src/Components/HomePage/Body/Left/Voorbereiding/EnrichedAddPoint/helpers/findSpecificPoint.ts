export function findSpecificPoint(input: {
  mapView: __esri.MapView | null;
  x: number;
  y: number;
}) {
  const findedPoint = input.mapView?.graphics
    .toArray()
    .find(
      (graphic) =>
        graphic.geometry &&
        graphic.geometry.type === "point" &&
        Math.abs(Number(graphic.geometry.x) - input.x) < 0.0001 &&
        Math.abs(Number(graphic.geometry.y) - input.y) < 0.0001
    );

  return findedPoint;
}
