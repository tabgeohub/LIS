/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";

import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

import { useEnrichedPointState } from "../../../../../../hooks/zustand/useEnrichedPointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import toast from "react-hot-toast";
import { createNewPointEvent } from "@helpers/ArcGISHelpers/createNewPointEvent";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function EnrichedAddPoint() {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedTab } = useTabState();
  const { points } = usePointsStore();

  const content = useContent();

  const {
    step,
    currentPoint,
    setLatitude,
    setLongitude,
    setStep,
    setXCoord,
    setYCoord,
    setMapClickedNotify,
    mapClickedNotify,
    setCurrentPoint,
    reset,
  } = useEnrichedPointState();

  function getDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000;
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const logAction = useLogAction();

  useEffect(() => {
    if (!redGraphicsLayer) return;

    let clickHandle: __esri.Handle;

    if ((step === 1 || step === 2) && mapView) {
      clickHandle = mapView.on("click", async (event) => {
        const lon = event.mapPoint.longitude;
        const lat = event.mapPoint.latitude;
        if (!lon || !lat) return;

        const isNear = points.some((p) => {
          const pLat = p.latitude;
          const pLon = p.longitude;

          return getDistanceInMeters(lat, lon, pLat, pLon) < 50;
        });

        if (isNear) {
          toast.error(
            content.voorbereiding.aandachtspuntAanmaken.step1.nearPointToast
          );
          return;
        }

        setMapClickedNotify(mapClickedNotify + 1);

        createNewPointEvent(
          event,
          redGraphicsLayer,
          setXCoord,
          setYCoord,
          setLatitude,
          setLongitude,
          setCurrentPoint
        );

        logAction({
          message: "User clicked on map to add point",
          newData: {
            latitude: lat,
            longitude: lon,
          },
        });

        if (step === 1) {
          setStep(3);
        }
      });
    }

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, step, currentPoint, mapClickedNotify]);

  function handleCancel() {
    redGraphicsLayer?.removeAll();

    setSelectedTab("none");
    reset();
  }

  return (
    <div className="mt-4 px-2 h-full">
      {step === 1 && <Step1 handleCancel={handleCancel} />}

      {step === 2 && <Step2 handleCancel={handleCancel} />}

      {step === 3 && <Step3 handleCancel={handleCancel} />}
    </div>
  );
}
