/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";

export function useStepContentMapSync(displayedPoints: unknown[]) {
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch {
        /* ignore */
      }
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();

    if (!displayedPoints.length) return;

    const graphics = createPointGraphics(displayedPoints as never[], {
      symbolOptions: {
        color: "blue",
        size: 10,
        style: "circle",
        outlineColor: "white",
        outlineWidth: 1,
      },
      transformCoordinates: true,
    });

    if (!graphics.length) return;

    if (pointsGraphicsLayer) {
      pointsGraphicsLayer.addMany(graphics as __esri.Graphic[]);
    } else if (mapView) {
      mapView.graphics.addMany(graphics as __esri.Graphic[]);
      blueGraphicsRef.current = graphics;
    }
  }, [displayedPoints, mapView, pointsGraphicsLayer]);

  useEffect(() => {
    return () => {
      pointsGraphicsLayer?.removeAll();
      if (mapView && blueGraphicsRef.current.length) {
        try {
          mapView.graphics.removeMany(blueGraphicsRef.current);
        } catch {
          /* ignore */
        }
        blueGraphicsRef.current = [];
      }
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);
}
