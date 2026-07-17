import createPoint from "@helpers/ArcGISHelpers/createPoint";
import {
  applyWgs84MapClickCoords,
  isValidMapClickPoint,
} from "Components/HomePage/Body/Common/EditPoint/editPointMapClickCoords";

type CoordSetter = (coords: {
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
}) => void;

export async function handleDeletePointEmptyMapClick(input: {
  event: __esri.ViewClickEvent;
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setCoords: CoordSetter;
}): Promise<void> {
  if (!isValidMapClickPoint(input.event.mapPoint)) return;

  const hit = await input.mapView.hitTest(input.event);
  const hasFeature = hit.results.some(
    (result) => (result as __esri.GraphicHit).graphic
  );
  if (hasFeature) return;

  const { longitude, latitude } = input.event.mapPoint!;
  const transformed = applyWgs84MapClickCoords({ longitude, latitude });

  input.setCurrentPoint({ x: longitude, y: latitude });
  input.setCoords({
    rdX: transformed.x,
    rdY: transformed.y,
    latitude,
    longitude,
  });

  if (input.currentPoint.x !== 0 && input.currentPoint.y !== 0) {
    const stale = input.mapView.graphics
      .toArray()
      .find(
        (graphic) =>
          graphic.geometry?.type === "point" &&
          graphic.geometry.x === input.currentPoint.x &&
          graphic.geometry.y === input.currentPoint.y
      );
    if (stale) input.mapView.graphics.remove(stale);
  }

  input.redGraphicsLayer.removeAll();
  input.redGraphicsLayer.add(createPoint(longitude, latitude));
}
