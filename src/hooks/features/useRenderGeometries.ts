/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useGeometriesStore } from "./useGeometriesStore";
import { useGeometryGraphicsRendering } from "./useGeometryGraphicsEffects";

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
