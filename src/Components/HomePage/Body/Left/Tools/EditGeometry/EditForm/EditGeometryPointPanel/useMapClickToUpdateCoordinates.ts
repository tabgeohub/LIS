import { useEffect } from "react";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import type { PointFormState } from "../helpers/pointForm";
import { toStr } from "./coords";

export default function useMapClickToUpdateCoordinates({
  patch,
}: {
  patch: (p: Partial<PointFormState>) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView) return;

    const clickHandle = mapView.on("click", (event) => {
      // @ts-ignore ArcGIS event may expose stopPropagation
      event.stopPropagation?.();

      const lonVal = event.mapPoint?.longitude;
      const latVal = event.mapPoint?.latitude;
      if (
        typeof lonVal !== "number" ||
        typeof latVal !== "number" ||
        !Number.isFinite(lonVal) ||
        !Number.isFinite(latVal)
      ) {
        return;
      }

      const transformed = getTransformedCoordinates(
        "WGS84",
        "RD",
        lonVal,
        latVal
      );

      const pointGraphic = createPoint(lonVal, latVal);
      redGraphicsLayer?.removeAll();
      if (redGraphicsLayer) {
        redGraphicsLayer.add(pointGraphic);
      } else {
        mapView.graphics.add(pointGraphic);
      }

      patch({
        longitude: toStr(lonVal),
        latitude: toStr(latVal),
        xcoordinaat_rd: toStr(transformed.x),
        ycoordinaat_rd: toStr(transformed.y),
      });
    });

    return () => {
      clickHandle?.remove();
      redGraphicsLayer?.removeAll();
    };
  }, [mapView, redGraphicsLayer, patch]);
}
