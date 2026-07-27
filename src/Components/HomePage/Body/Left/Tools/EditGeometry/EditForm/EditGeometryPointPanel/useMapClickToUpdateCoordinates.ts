import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import type { PointFormState } from "../helpers/pointForm";
import {
  patchCoordsFromLonLat,
  placeClickPointGraphic,
  readFiniteLonLat,
} from "./applyMapClickCoordinates";

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
      const coords = readFiniteLonLat(event.mapPoint);
      if (!coords) return;
      placeClickPointGraphic({
        lon: coords.lon,
        lat: coords.lat,
        mapView,
        redGraphicsLayer,
      });
      patchCoordsFromLonLat({ lon: coords.lon, lat: coords.lat, patch });
    });

    return () => {
      clickHandle?.remove();
      redGraphicsLayer?.removeAll();
    };
  }, [mapView, redGraphicsLayer, patch]);
}
