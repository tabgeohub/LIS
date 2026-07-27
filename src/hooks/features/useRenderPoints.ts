/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { usePointsStore } from "./usePointsStore";
import { usePointGraphicsClick, usePointGraphicsRendering } from "./usePointGraphicsEffects";

export function useRenderPoints() {
  const { map, mapView, pointsGraphicsLayer } = useMapViewState();
  const { points, fetchPoints } = usePointsStore();
  const { setClickedPointId, setClickedPoint } = usePopUpState();
  const { user } = useAuth();
  const { selectedTab, selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((state) => state.plans);
  useEffect(() => {
    if (user.user_id) fetchPoints({ regio: user.role });
  }, [user.user_id, user.role]);
  usePointGraphicsRendering({ map, layer: pointsGraphicsLayer, points, userId: user.user_id, selectedTab, selectedPage, timesliderPlans });
  const selectPoint = useCallback(
    (options: { point: (typeof points)[number] }) => {
      setClickedPointId(options.point.id);
      setClickedPoint(options.point);
    },
    [setClickedPointId, setClickedPoint]
  );
  usePointGraphicsClick({
    mapView,
    layer: pointsGraphicsLayer,
    onPoint: (point) => selectPoint({ point }),
  });
}
