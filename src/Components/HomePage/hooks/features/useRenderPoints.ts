/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { usePopUpState } from "hooks/zustand/ui/popUpState";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useTimesliderState } from "hooks/zustand/ui/useTimesliderState";
import { usePointsStore } from "hooks/features/usePointsStore";
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
