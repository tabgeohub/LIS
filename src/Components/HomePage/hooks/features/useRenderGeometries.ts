/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useTimesliderState } from "hooks/zustand/ui/useTimesliderState";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useFlightPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useGeometryGraphicsRendering } from "hooks/features/useGeometryGraphicsEffects";

export function useRenderGeometries() {
  const { user } = useAuth();
  const { geometriesGraphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();
  const { selectedPage } = useTabState();
  const timesliderPlans = useTimesliderState((state) => state.plans);
  const { step } = useFinishedPlansState();
  const { step: flightPlanStep } = useFlightPlanState();
  useEffect(() => {
    if (user.user_id) fetchGeometries({ regio: user.role && user.role !== "admin" ? user.role : undefined });
  }, [user.user_id, user.role]);
  useGeometryGraphicsRendering({
    layer: geometriesGraphicsLayer,
    geometries,
    userId: user.user_id,
    selectedPage,
    timesliderPlans,
    step,
    flightPlanStep,
  });
}
