import createPoint from "@helpers/ArcGISHelpers/createPoint";
import {
  applyWgs84MapClickCoords,
  isValidMapClickPoint,
} from "Components/Common/EditPoint/editPointMapClickCoords";

export type DeletePointCoordSetter = (coords: {
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
}) => void;

function hitHasFeature(hit: __esri.HitTestResult): boolean {
  return hit.results.some(
    (result) => (result as __esri.GraphicHit).graphic
  );
}

function isOriginPoint(point: { x: number; y: number }): boolean {
  return point.x === 0 || point.y === 0;
}

function matchesStalePointGraphic(
  graphic: __esri.Graphic,
  currentPoint: { x: number; y: number }
): boolean {
  return (
    graphic.geometry?.type === "point" &&
    graphic.geometry.x === currentPoint.x &&
    graphic.geometry.y === currentPoint.y
  );
}

function removeStalePointGraphic(input: {
  mapView: __esri.MapView;
  currentPoint: { x: number; y: number };
}) {
  if (isOriginPoint(input.currentPoint)) return;

  const stale = input.mapView.graphics
    .toArray()
    .find((graphic) => matchesStalePointGraphic(graphic, input.currentPoint));
  if (stale) input.mapView.graphics.remove(stale);
}

export async function handleDeletePointEmptyMapClick(input: {
  event: __esri.ViewClickEvent;
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setCoords: DeletePointCoordSetter;
}): Promise<void> {
  if (!isValidMapClickPoint(input.event.mapPoint)) return;

  const hit = await input.mapView.hitTest(input.event);
  if (hitHasFeature(hit)) return;

  const mapPoint = input.event.mapPoint!;
  const longitude = Number(mapPoint.longitude);
  const latitude = Number(mapPoint.latitude);
  const transformed = applyWgs84MapClickCoords({ longitude, latitude });

  input.setCurrentPoint({ x: longitude, y: latitude });
  input.setCoords({
    rdX: transformed.x,
    rdY: transformed.y,
    latitude,
    longitude,
  });

  removeStalePointGraphic(input);

  input.redGraphicsLayer.removeAll();
  input.redGraphicsLayer.add(createPoint(longitude, latitude));
}
