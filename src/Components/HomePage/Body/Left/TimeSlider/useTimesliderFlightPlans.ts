import { useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import {
  useDrawTimesliderHighlights,
  useLoadTimesliderPlans,
} from "./timesliderFlightPlanEffects";

export function useTimesliderFlightPlans() {
  const role = useAuth((state) => state.user.role);
  const yellowGraphicsLayer = useMapViewState(
    (state) => state.yellowGraphicsLayer
  );
  const state = useTimesliderState();
  const [loading, setLoading] = useState(false);

  useLoadTimesliderPlans({
    role,
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    setPlans: state.setPlans,
    setSelectedPlanIds: state.setSelectedPlanIds,
    setLoading,
  });

  useDrawTimesliderHighlights({
    yellowGraphicsLayer,
    plans: state.plans,
    selectedPlanIds: state.selectedPlanIds,
  });

  return {
    ...state,
    loading,
    hasRange: Boolean(state.dateFrom && state.dateTo),
  };
}
