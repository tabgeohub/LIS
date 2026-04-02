/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { usePointsStore } from "./usePointsStore";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";

export function useRenderPoints() {
  const { map, mapView, pointsGraphicsLayer } = useMapViewState();
  const { points, fetchPoints } = usePointsStore();
  const { setClickedPointId, setClickedPoint } = usePopUpState();
  const { user } = useAuth();
  const { selectedTab, selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((s) => s.plans);

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;

    // Only fetch once - fetchPoints now populates both points and dbPoints
    fetchPoints({
      regio: user.role,
    });
  }, [user.user_id, user.role]);

  useEffect(() => {
    if (!validateMapView(map, pointsGraphicsLayer) || !points) return;

    if (user.user_id === undefined || user.user_id === 0) return;

    // Hide points when in editGeometry tab
    if (selectedTab === "editGeometry") {
      pointsGraphicsLayer?.removeAll();
      return;
    }

    const blueSymbol = new SimpleMarkerSymbol({
      color: "blue",
      size: 12,
      style: "circle",
      outline: {
        color: "white",
        width: 1,
      },
    });

    // Timeslider page: only points that belong to the current flight plan list
    if (selectedPage === "timeslider") {
      if (timesliderPlans.length === 0) {
        pointsGraphicsLayer?.removeAll();
        return;
      }
      const { pointIds } = getPointAndGeometryIdsFromPlans(timesliderPlans);
      const filteredPoints = points.filter((p) => pointIds.has(p.id));
      const graphicsTs = filteredPoints.map((point) => {
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
      replaceGraphics(pointsGraphicsLayer, graphicsTs);
      return;
    }

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

    replaceGraphics(pointsGraphicsLayer, graphics);
  }, [map, points, user.user_id, selectedTab, selectedPage, timesliderPlans]);

  useEffect(() => {
    if (!validateMapView(mapView, pointsGraphicsLayer)) return;

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
        const response = await mapView?.hitTest(event, {
          include: [pointsGraphicsLayer as any as __esri.Layer ],
        });

        const clicked = response?.results.find(
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

    const handle = mapView?.on("click", handleClick);
    return () => handle?.remove();
  }, [mapView, pointsGraphicsLayer]);
}

