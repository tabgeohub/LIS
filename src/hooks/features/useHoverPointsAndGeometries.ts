/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { attachMapHoverLifecycle } from "./attachMapHoverLifecycle";

interface UseHoverPointsAndGeometriesOptions {
  pinRefs?: React.MutableRefObject<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >;
  checkMapContainer?: boolean;
}

export function useHoverPointsAndGeometries(
  options: UseHoverPointsAndGeometriesOptions = {}
) {
  const { mapView, pointsGraphicsLayer, geometriesGraphicsLayer } =
    useMapViewState();
  const { pinRefs, checkMapContainer = false } = options;

  useEffect(
    () =>
      attachMapHoverLifecycle({
        mapView,
        pointsGraphicsLayer,
        geometriesGraphicsLayer,
        pinRefs,
        checkMapContainer,
      }),
    [mapView, pointsGraphicsLayer, geometriesGraphicsLayer, pinRefs, checkMapContainer]
  );
}
