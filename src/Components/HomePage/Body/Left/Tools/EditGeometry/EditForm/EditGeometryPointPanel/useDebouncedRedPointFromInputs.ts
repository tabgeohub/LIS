import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import type { PointFormState } from "../helpers/pointForm";
import { parseFinite } from "./coords";

/**
 * Draws a red point from coordinate inputs after a short typing delay.
 * Supports either direct WGS84 values or RD converted to WGS84.
 */
export default function useDebouncedRedPointFromInputs({
  form,
  delayMs = 500,
}: {
  form: PointFormState;
  delayMs?: number;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView) return;

    const timeout = setTimeout(() => {
      const lon = parseFinite(form.longitude);
      const lat = parseFinite(form.latitude);

      let targetLon: number | null = null;
      let targetLat: number | null = null;

      if (lon != null && lat != null) {
        targetLon = lon;
        targetLat = lat;
      } else {
        const x = parseFinite(form.xcoordinaat_rd);
        const y = parseFinite(form.ycoordinaat_rd);
        if (x != null && y != null) {
          const transformed = getTransformedCoordinates("RD", "WGS84", x, y);
          if (Number.isFinite(transformed.x) && Number.isFinite(transformed.y)) {
            targetLon = transformed.x;
            targetLat = transformed.y;
          }
        }
      }

      if (targetLon == null || targetLat == null) return;

      const pointGraphic = createPoint(targetLon, targetLat);
      redGraphicsLayer?.removeAll();
      if (redGraphicsLayer) {
        redGraphicsLayer.add(pointGraphic);
      } else {
        mapView.graphics.add(pointGraphic);
      }
    }, delayMs);

    return () => {
      clearTimeout(timeout);
    };
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
