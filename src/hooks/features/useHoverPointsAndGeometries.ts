/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { findHoveredMapGraphic, toHoveredState } from "./hoverMapGraphic";

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

    const handle = mapView.on("pointer-move", async (event) => {
      if (checkMapContainer) {
        const target = event.native.target as HTMLElement;
        const mapContainer = mapView.container;
        if (!mapContainer || !mapContainer.contains(target)) return;
      }

      const hit = await mapView.hitTest(event);
      const graphic = findHoveredMapGraphic({
        results: hit.results,
        pointsGraphicsLayer,
        geometriesGraphicsLayer,
        pinRefs,
      });

      setHovered(graphic ? toHoveredState(graphic) : null);
    });

    return () => {
      handle.remove();
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer, geometriesGraphicsLayer, pinRefs, checkMapContainer]);
}
