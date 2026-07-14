import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import {
  drawSelectedPlansYellowHighlights,
  removeTimesliderHighlights,
  sortPlansNewestFirst,
} from "@helpers/timeslider";
import { FinishedFlightPlanType } from "Types/finished_plans";

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
    axios
      .get<FinishedFlightPlanType[]>(
        `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
        {
          params: {
            regio_id: role,
            from: dayjs(state.dateFrom).format("YYYY-MM-DD"),
            to: dayjs(state.dateTo).format("YYYY-MM-DD"),
          },
        }
      )
      .then((response) => state.setPlans(sortPlansNewestFirst(response.data || [])))
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
