/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { registerMapHoverHandler } from "./registerMapHoverHandler";

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

  useEffect(() => {
    if (!validateMapView(mapView)) return;
    const { setHovered } = useHoveredGraphicState.getState();
    const handle = registerMapHoverHandler({
      mapView: mapView!,
      pointsGraphicsLayer,
      geometriesGraphicsLayer,
      pinRefs,
      checkMapContainer,
      onHovered: setHovered,
    });

    return () => {
      handle.remove();
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer, geometriesGraphicsLayer, pinRefs, checkMapContainer]);
}
