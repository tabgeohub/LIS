import { useEffect } from "react";
import {
  drawSelectedPlansYellowHighlights,
  removeTimesliderHighlights,
} from "@helpers/timeslider";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { fetchTimesliderFinishedPlans } from "./fetchTimesliderFinishedPlans";

export function loadTimesliderPlansForRange(input: {
  role: string;
  dateFrom: string;
  dateTo: string;
  setPlans: (plans: FinishedFlightPlanType[]) => void;
  setLoading: (loading: boolean) => void;
}): void {
  input.setLoading(true);
  fetchTimesliderFinishedPlans({
    regioId: input.role,
    dateFrom: input.dateFrom,
    dateTo: input.dateTo,
  })
    .then((plans) => input.setPlans(plans))
    .catch(() => input.setPlans([]))
    .finally(() => input.setLoading(false));
}

export function useLoadTimesliderPlans(input: {
  role: string | null | undefined;
  dateFrom: string | null | undefined;
  dateTo: string | null | undefined;
  setPlans: (plans: FinishedFlightPlanType[]) => void;
  setSelectedPlanIds: (ids: number[]) => void;
  setLoading: (loading: boolean) => void;
}) {
  useEffect(() => {
    if (!input.dateFrom || !input.dateTo || !input.role) {
      input.setPlans([]);
      input.setSelectedPlanIds([]);
      return;
    }
    loadTimesliderPlansForRange({
      role: input.role,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      setPlans: input.setPlans,
      setLoading: input.setLoading,
    });
  }, [
    input.dateFrom,
    input.dateTo,
    input.role,
    input.setPlans,
    input.setSelectedPlanIds,
  ]);
}

export function useDrawTimesliderHighlights(input: {
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  plans: FinishedFlightPlanType[];
  selectedPlanIds: number[];
}) {
  useEffect(() => {
    if (!input.yellowGraphicsLayer) return;
    removeTimesliderHighlights(input.yellowGraphicsLayer);
    if (!input.selectedPlanIds.length || !input.plans.length) return;
    drawSelectedPlansYellowHighlights({
      layer: input.yellowGraphicsLayer,
      plans: input.plans,
      selectedPlanIds: input.selectedPlanIds,
    });
  }, [input.plans, input.selectedPlanIds, input.yellowGraphicsLayer]);
}
