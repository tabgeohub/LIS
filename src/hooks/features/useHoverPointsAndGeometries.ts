/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

interface UseHoverPointsAndGeometriesOptions {
  /**
   * Optional ref to track pins (for components that use pins)
   */
  pinRefs?: React.MutableRefObject<Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>>;
  /**
   * If true, only handle hover when mouse is over the map container
   */
  checkMapContainer?: boolean;
}

/**
 * Hook to handle hover events for both points and geometries on the map
 */
export function useHoverPointsAndGeometries(options: UseHoverPointsAndGeometriesOptions = {}) {
  const { mapView, pointsGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();
  const { pinRefs, checkMapContainer = false } = options;

  useEffect(() => {
    if (!validateMapView(mapView)) return;
    const { setHovered } = useHoveredGraphicState.getState();

    const handle = mapView.on("pointer-move", async (event) => {
      // Check if the event target is within the map view container (if requested)
      if (checkMapContainer) {
        const target = event.native.target as HTMLElement;
        const mapContainer = mapView.container;
        if (!mapContainer || !mapContainer.contains(target)) {
          return; // Mouse is not over the map, don't interfere with list hover
        }
      }

      const hit: any = await mapView.hitTest(event);
      const res: any[] = hit?.results || [];
      const g: any = res.find((r: any) => {
        const gr = r?.graphic;
        if (!gr?.attributes) return false;

        // Check for pins (if pinRefs provided)
        if (pinRefs) {
          const id = gr.attributes.id;
          const isPin = typeof id === "number" && pinRefs.current.has(id);
          if (isPin) return true;
        }

        // Check for blue points
        const isBluePoint =
          !!pointsGraphicsLayer && gr.layer === pointsGraphicsLayer;

        // Check for blue geometries
        const isBlueGeometry =
          !!geometriesGraphicsLayer && gr.layer === geometriesGraphicsLayer;

        return isBluePoint || isBlueGeometry;
      })?.graphic;

      if (g) {
        setHovered({
          id: g.attributes.id || g.attributes.geometryId,
          label: g.attributes.omschrijving || "",
        });
      } else {
        setHovered(null);
      }
    });

    return () => {
      handle.remove();
      const { setHovered } = useHoveredGraphicState.getState();
      setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer, geometriesGraphicsLayer, pinRefs, checkMapContainer]);
}

