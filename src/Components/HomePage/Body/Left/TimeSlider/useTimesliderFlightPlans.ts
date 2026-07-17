import { useEffect, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import {
  drawSelectedPlansYellowHighlights,
  removeTimesliderHighlights,
} from "@helpers/timeslider";
import { fetchTimesliderFinishedPlans } from "./fetchTimesliderFinishedPlans";

export function useTimesliderFlightPlans() {
  const role = useAuth((state) => state.user.role);
  const yellowGraphicsLayer = useMapViewState((state) => state.yellowGraphicsLayer);
  const state = useTimesliderState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.dateFrom || !state.dateTo || !role) {
      state.setPlans([]);
      state.setSelectedPlanIds([]);
      return;
    }
    setLoading(true);
    fetchTimesliderFinishedPlans({
      regioId: role,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
    })
      .then((plans) => state.setPlans(plans))
      .catch(() => state.setPlans([]))
      .finally(() => setLoading(false));
  }, [state.dateFrom, state.dateTo, role, state.setPlans, state.setSelectedPlanIds]);

  useEffect(() => {
    if (!yellowGraphicsLayer) return;
    removeTimesliderHighlights(yellowGraphicsLayer);
    if (!state.selectedPlanIds.length || !state.plans.length) return;
    drawSelectedPlansYellowHighlights({
      layer: yellowGraphicsLayer,
      plans: state.plans,
      selectedPlanIds: state.selectedPlanIds,
    });
  }, [state.plans, state.selectedPlanIds, yellowGraphicsLayer]);

  return { ...state, loading, hasRange: Boolean(state.dateFrom && state.dateTo) };
}
