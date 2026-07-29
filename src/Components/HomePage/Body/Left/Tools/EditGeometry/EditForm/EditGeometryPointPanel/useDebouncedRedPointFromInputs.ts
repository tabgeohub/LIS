import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import createPoint from "Components/HomePage/helpers/ArcGISHelpers/createPoint";
import type { PointFormState } from "../helpers/pointForm";
import { resolveDebouncedPointWgs84 } from "./resolveDebouncedPointWgs84";

export default function useDebouncedRedPointFromInputs(input: {
  form: PointFormState;
  delayMs?: number;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { form, delayMs = 500 } = input;

  useEffect(() => {
    if (!mapView) return;

    const timeout = setTimeout(() => {
      const coords = resolveDebouncedPointWgs84(form);
      if (!coords) return;

      const pointGraphic = createPoint(coords.longitude, coords.latitude);
      redGraphicsLayer?.removeAll();
      if (redGraphicsLayer) {
        redGraphicsLayer.add(pointGraphic);
      } else {
        mapView.graphics.add(pointGraphic);
      }
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [
    mapView,
    redGraphicsLayer,
    delayMs,
    form.longitude,
    form.latitude,
    form.xcoordinaat_rd,
    form.ycoordinaat_rd,
  ]);
}
