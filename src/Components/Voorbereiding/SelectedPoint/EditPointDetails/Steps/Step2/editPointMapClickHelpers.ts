import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { LogActionInput } from "hooks/logging/logEntry";

export function createEditedPointValues<T extends Record<string, unknown>>(input: {
  values: T;
  longitude: number;
  latitude: number;
}) {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.longitude,
    y: input.latitude,
  });
  return {
    ...input.values,
    x: transformed.x,
    y: transformed.y,
    latitude: input.latitude,
    longitude: input.longitude,
  } as T;
}

export function replaceEditedPointGraphic(input: {
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  longitude: number;
  latitude: number;
}) {
  const graphic = createPoint(input.longitude, input.latitude);
  input.redGraphicsLayer?.removeAll();
  if (input.redGraphicsLayer) {
    if (input.mapView.map) {
      input.mapView.map.reorder(
        input.redGraphicsLayer,
        input.mapView.map.layers.length - 1
      );
    }
    input.redGraphicsLayer.add(graphic);
  } else {
    input.mapView.graphics.add(graphic);
  }
}

export function createEditPointClickHandler<T extends Record<string, unknown>>(input: {
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setValues: (values: T, shouldValidate?: boolean) => unknown;
  values: T;
  logAction: (entry: LogActionInput) => unknown;
}) {
  return async (event: __esri.ViewClickEvent) => {
    // @ts-ignore ArcGIS event may expose stopPropagation
    event.stopPropagation?.();
    const { longitude, latitude } = event.mapPoint;
    if (!longitude || !latitude) return;
    input.setMapClickedNotify(input.mapClickedNotify + 1);
    input.setCurrentPoint({ x: longitude, y: latitude });
    input.setValues(
      createEditedPointValues({
        values: input.values,
        longitude,
        latitude,
      })
    );
    replaceEditedPointGraphic({ ...input, longitude, latitude });
    input.logAction({
      message: "User clicked on a point",
      newData: { point: { x: longitude, y: latitude } },
    });
  };
}
