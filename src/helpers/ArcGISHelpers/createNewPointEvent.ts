import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "./getTransformedCoordinates";

export type CreateNewPointEventInput = {
  event: __esri.ViewClickEvent;
  redGraphicsLayer: __esri.GraphicsLayer;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
};

export function createNewPointEvent(input: CreateNewPointEventInput) {
  const {
    event,
    redGraphicsLayer,
    setXCoord,
    setYCoord,
    setLatitude,
    setLongitude,
    setCurrentPoint,
  } = input;

  redGraphicsLayer.removeAll();

  if (!event.mapPoint || !event.mapPoint.longitude || !event.mapPoint.latitude)
    return;

  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: event.mapPoint.longitude,
    y: event.mapPoint.latitude,
  });

  setXCoord(transformed.x);
  setYCoord(transformed.y);

  setCurrentPoint({
    x: transformed.x,
    y: transformed.y,
  });

  setLongitude(event.mapPoint.longitude);
  setLatitude(event.mapPoint.latitude);

  const pointGraphic = createPoint(
    event.mapPoint.longitude,
    event.mapPoint.latitude
  );

  redGraphicsLayer.add(pointGraphic);
}
