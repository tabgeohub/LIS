import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import React from "react";
import { getDistanceInMeters } from "../../helpers/getDistanceInMeters";
import toast from "react-hot-toast";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function NextBtn() {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { points } = usePointsStore();

  const content = useContent();

  const {
    xCoord,
    yCoord,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setStep,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();

  const logAction = useLogAction();

  const graphicPosition = () => {
    if (mapView) {
      const lon = longitude;
      const lat = latitude;
      if (!lon || !lat) return;

      const isNear = points.some((p) => {
        const pLat = p.latitude;
        const pLon = p.longitude;

        return getDistanceInMeters(lat, lon, pLat, pLon) < 50;
      });

      if (isNear) {
        toast.error(content.voorbereiding.aandachtspuntAanmaken.step3.warning);
        return;
      }

      if (!longitude || !latitude) return;

      const transformed = getTransformedCoordinates(
        "WGS84",
        "RD",
        longitude,
        latitude
      );

      setXCoord(transformed.x);
      setYCoord(transformed.y);

      setLongitude(longitude);
      setLatitude(latitude);

      const pointGraphic = createPoint(longitude, latitude);

      redGraphicsLayer?.add(pointGraphic);

      logAction({
        message: "User clicked 'Next' button",
        step: "Second step",
        newData: {
          latitude: latitude,
          longitude: longitude,
        },
      });

      setStep(3);
    }
  };

  return (
    <button
      onClick={graphicPosition}
      disabled={xCoord === 0 && yCoord === 0}
      className="gray-button"
    >
      {content.common.volgende}
    </button>
  );
}
