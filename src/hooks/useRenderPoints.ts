/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { usePointsStore } from "./zustand/usePointsStore";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export function useRenderPoints() {
  const { map, mapView, pointsGraphicsLayer } = useMapViewState();
  const { points, fetchPoints, fetchDBPoints } = usePointsStore();
  const { setClickedPointId, setClickedPoint } = usePopUpState();
  const { user } = useAuth();

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;

    fetchPoints({
      regio: user.role,
    });

    fetchDBPoints({
      regio: user.role,
    });
  }, [user]);

  useEffect(() => {
    if (!map || !pointsGraphicsLayer || !points) return;

    if (user.user_id === undefined || user.user_id === 0) return;

    pointsGraphicsLayer.removeAll();

    const blueSymbol = new SimpleMarkerSymbol({
      color: "blue",
      size: 12,
      style: "circle",
      outline: {
        color: "white",
        width: 1,
      },
    });

    const graphics = points.map((point) => {
      const geometry = new Point({
        x: point.longitude,
        y: point.latitude,
      });

      return new Graphic({
        geometry,
        symbol: blueSymbol,
        attributes: point,
      });
    });

    pointsGraphicsLayer.addMany(graphics);
  }, [map, points, user]);

  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer) return;

    let isProcessing = false;
    let lastClickTime = 0;
    const DEBOUNCE_MS = 150; // Debounce rapid clicks

    const handleClick = async (event: __esri.ViewClickEvent) => {
      // Debounce rapid clicks
      const now = Date.now();
      if (now - lastClickTime < DEBOUNCE_MS) {
        return;
      }
      lastClickTime = now;

      // Prevent multiple simultaneous clicks
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      try {
        // Optimize hitTest to only check pointsGraphicsLayer
        const response = await mapView.hitTest(event, {
          include: [pointsGraphicsLayer],
        });

        const clicked = response.results.find(
          // @ts-ignore
          (r) => r.graphic?.layer === pointsGraphicsLayer
        );

        if (clicked) {
          // @ts-ignore
          const pointAttrs = clicked.graphic.attributes;

          if (pointAttrs?.id) {
            setClickedPointId(pointAttrs.id);
            setClickedPoint(pointAttrs);
          }
        }
      } catch (error) {
        console.error("Error in point click handler:", error);
      } finally {
        isProcessing = false;
      }
    };

    const handle = mapView.on("click", handleClick);
    return () => handle.remove();
  }, [mapView, pointsGraphicsLayer]);
}
