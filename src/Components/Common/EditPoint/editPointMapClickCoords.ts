import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export function applyWgs84MapClickCoords(input: {
  longitude: number;
  latitude: number;
}) {
  return getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.longitude,
    y: input.latitude,
  });
}

export function addRedPointGraphic(input: {
  mapView: __esri.MapView;
  redGraphicsLayer?: __esri.GraphicsLayer | null;
  longitude: number;
  latitude: number;
}) {
  input.redGraphicsLayer?.removeAll();
  const graphic = createPoint(input.longitude, input.latitude);

  if (input.redGraphicsLayer) {
    input.redGraphicsLayer.add(graphic);
    return;
  }

  input.mapView.graphics.add(graphic);
}

export function isValidMapClickPoint(mapPoint?: __esri.Point | null) {
  return !!(
    mapPoint?.longitude &&
    mapPoint?.latitude &&
    Number.isFinite(mapPoint.longitude) &&
    Number.isFinite(mapPoint.latitude)
  );
}
