/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import {
  attachMapHoverLifecycle,
  type AttachMapHoverLifecycleInput,
} from "./attachMapHoverLifecycle";

type UseHoverPointsAndGeometriesOptions = Pick<
  AttachMapHoverLifecycleInput,
  "pinRefs" | "checkMapContainer"
>;

export function useHoverPointsAndGeometries(
  options: UseHoverPointsAndGeometriesOptions = {}
) {
  const { mapView, pointsGraphicsLayer, geometriesGraphicsLayer } =
    useMapViewState();

  useEffect(
    () =>
      attachMapHoverLifecycle({
        mapView,
        pointsGraphicsLayer,
        geometriesGraphicsLayer,
        ...options,
      }),
    [mapView, pointsGraphicsLayer, geometriesGraphicsLayer, options.pinRefs, options.checkMapContainer]
  );
}
