import { useCallback } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { calculateCenterAndZoom } from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";

export function useTimesliderListGoTo() {
  const { mapView } = useMapViewState();

  const goToPoint = useCallback(
    (point: FinishedPointType) => {
      if (!mapView) return;
      const coords = getPointCoordinates(point, true);
      if (!coords) return;
      void mapView.goTo({
        target: {
          geometry: {
            type: "point",
            x: coords.longitude,
            y: coords.latitude,
          },
        },
        zoom: 15,
      });
    },
    [mapView]
  );

  const goToGeometry = useCallback(
    (geometry: FinishedGeometryType) => {
      if (!mapView) return;
      const pts = (geometry.points || [])
        .filter(
          (p) =>
            typeof p.latitude === "number" &&
            typeof p.longitude === "number" &&
            Number.isFinite(p.latitude) &&
            Number.isFinite(p.longitude)
        )
        .map((p) => ({ latitude: p.latitude!, longitude: p.longitude! }));
      if (pts.length === 0) return;
      const { center, zoom } = calculateCenterAndZoom(pts);
      if (
        !Number.isFinite(center.latitude) ||
        !Number.isFinite(center.longitude)
      ) {
        return;
      }
      void mapView.goTo({
        target: {
          geometry: {
            type: "point",
            x: center.longitude,
            y: center.latitude,
          },
        },
        zoom,
      });
    },
    [mapView]
  );

  return { goToPoint, goToGeometry };
}
