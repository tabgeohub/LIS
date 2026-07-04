/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";

export function useAddPointStepMapClick(input: {
  addPointStep: number;
  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setAddPointStep: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((input.addPointStep === 2 || input.addPointStep === 1) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        if (!event.mapPoint.longitude || !event.mapPoint.latitude) return;

        input.setMapClickedNotify(input.mapClickedNotify + 1);

        input.setCurrentPoint({
          x: event.mapPoint.longitude,
          y: event.mapPoint.latitude,
        });

        createNewPointEvent({
          event,
          redGraphicsLayer,
          setXCoord: input.setXCoord,
          setYCoord: input.setYCoord,
          setLatitude: input.setLatitude,
          setLongitude: input.setLongitude,
          setCurrentPoint: input.setCurrentPoint,
        });

        if (input.addPointStep === 1) {
          input.setAddPointStep(3);
        }
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.addPointStep, input.mapClickedNotify]);
}
