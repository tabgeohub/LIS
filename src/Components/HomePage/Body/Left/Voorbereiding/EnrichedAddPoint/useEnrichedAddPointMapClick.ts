/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import toast from "react-hot-toast";
import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";
import useLogAction from "hooks/useLogAction";
import { getDistanceInMeters } from "./helpers/getDistanceInMeters";

const NEAR_POINT_THRESHOLD_METERS = 50;

export function useEnrichedAddPointMapClick(input: {
  step: number;
  points: EnrichedPointType[];
  mapClickedNotify: number;
  nearPointToast: string;
  setMapClickedNotify: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setStep: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((input.step === 1 || input.step === 2) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        const lon = event.mapPoint.longitude;
        const lat = event.mapPoint.latitude;
        if (!lon || !lat) return;

        const isNear = input.points.some((p) =>
          getDistanceInMeters({
            from: { lat, lon },
            to: { lat: p.latitude, lon: p.longitude },
          }) < NEAR_POINT_THRESHOLD_METERS
        );

        if (isNear) {
          toast.error(input.nearPointToast);
          return;
        }

        input.setMapClickedNotify(input.mapClickedNotify + 1);

        createNewPointEvent({
          event,
          redGraphicsLayer,
          setXCoord: input.setXCoord,
          setYCoord: input.setYCoord,
          setLatitude: input.setLatitude,
          setLongitude: input.setLongitude,
          setCurrentPoint: input.setCurrentPoint,
        });

        logAction({
          message: "User clicked on map to add point",
          newData: { latitude: lat, longitude: lon },
        });

        if (input.step === 1) {
          input.setStep(3);
        }
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, input.step, input.mapClickedNotify, input.points]);
}
