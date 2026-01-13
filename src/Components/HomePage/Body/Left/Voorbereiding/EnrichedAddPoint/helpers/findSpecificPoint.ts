export function findSpecificPoint(
  mapView: __esri.MapView | null,
  x: number,
  y: number
) {
  const findedPoint = mapView?.graphics
    .toArray()
    .find(
      (graphic) =>
        graphic.geometry &&
        graphic.geometry.type === "point" &&
        Math.abs(Number(graphic.geometry.x) - x) < 0.0001 &&
        Math.abs(Number(graphic.geometry.y) - y) < 0.0001
    );

  return findedPoint;
}
