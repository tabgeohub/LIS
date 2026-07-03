/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";

export function useEditPointFormMapClick(input: {
  subStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setValues: (values: Record<string, unknown>) => void;
  values: Record<string, unknown>;
}) {
  const logAction = useLogAction();
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    let clickHandle: __esri.Handle;

    if (input.subStep === 1 && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        // @ts-ignore ArcGIS event may expose stopPropagation
        event.stopPropagation?.();

        if (!event.mapPoint.longitude || !event.mapPoint.latitude) return;

        input.setMapClickedNotify(input.mapClickedNotify + 1);
        input.setCurrentPoint({
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        redGraphicsLayer?.removeAll();

        if (mapView.map && redGraphicsLayer) {
          mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
        }

        const transformed = getTransformedCoordinates({
          fromProjection: "WGS84",
          toProjection: "RD",
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        input.setValues({
          ...input.values,
          x: transformed.x,
          y: transformed.y,
          latitude: event.mapPoint.latitude,
          longitude: event.mapPoint.longitude,
        });

        const pointGraphic = createPoint(
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );

        if (redGraphicsLayer) {
          redGraphicsLayer.add(pointGraphic);
        } else {
          mapView.graphics.add(pointGraphic);
        }

        logAction({
          message: "User clicked on a point",
          newData: {
            point: {
              x: event.mapPoint.longitude,
              y: event.mapPoint.latitude,
            },
          },
        });
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [
    input.subStep,
    input.mapClickedNotify,
    mapView,
    redGraphicsLayer,
    input.setValues,
    input.values,
  ]);
}
