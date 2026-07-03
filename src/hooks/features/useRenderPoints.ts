/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "./usePointsStore";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import { buildPointMapGraphics } from "./pointMapGraphics";

export function useRenderPoints() {
  const { map, mapView, pointsGraphicsLayer } = useMapViewState();
  const { points, fetchPoints } = usePointsStore();
  const { setClickedPointId, setClickedPoint } = usePopUpState();
  const { user } = useAuth();
  const { selectedTab, selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((s) => s.plans);

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchPoints({ regio: user.role });
  }, [user.user_id, user.role]);

  useEffect(() => {
    if (!validateMapView(map, pointsGraphicsLayer) || !points) return;
    if (user.user_id === undefined || user.user_id === 0) return;

    if (selectedTab === "editGeometry") {
      pointsGraphicsLayer?.removeAll();
      return;
    }

    if (selectedPage === "timeslider") {
      if (timesliderPlans.length === 0) {
        pointsGraphicsLayer?.removeAll();
        return;
      }

      const { pointIds } = getPointAndGeometryIdsFromPlans(timesliderPlans);
      const filteredPoints = points.filter((p) => pointIds.has(p.id));
      replaceGraphics(pointsGraphicsLayer, buildPointMapGraphics(filteredPoints));
      return;
    }

    replaceGraphics(pointsGraphicsLayer, buildPointMapGraphics(points));
  }, [map, points, user.user_id, selectedTab, selectedPage, timesliderPlans]);

  useEffect(() => {
    if (!validateMapView(mapView, pointsGraphicsLayer)) return;

    const clickGuard = createDebouncedClickGuard();

    const handleClick = async (event: __esri.ViewClickEvent) => {
      if (clickGuard.shouldSkip()) return;

      try {
        const response = await mapView?.hitTest(event, {
          include: [pointsGraphicsLayer as __esri.Layer],
        });

        const clicked = response?.results.find(
          (r) => (r as __esri.GraphicHit).graphic?.layer === pointsGraphicsLayer
        ) as __esri.GraphicHit | undefined;

        const pointAttrs = clicked?.graphic?.attributes;
        if (pointAttrs?.id) {
          setClickedPointId(pointAttrs.id);
          setClickedPoint(pointAttrs);
        }
      } catch (error) {
        console.error("Error in point click handler:", error);
      } finally {
        clickGuard.finish();
      }
    };

    const handle = mapView?.on("click", handleClick);
    return () => handle?.remove();
  }, [mapView, pointsGraphicsLayer]);
}
