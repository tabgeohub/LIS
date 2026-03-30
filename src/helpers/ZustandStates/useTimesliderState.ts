import { create } from "zustand";
import { FinishedFlightPlanType } from "Types/finished_plans";

export const useTimesliderState = create<{
  dateFrom: string;
  dateTo: string;
  setDateRange: (from: string, to: string) => void;
  selectedPlanIds: number[];
  plans: FinishedFlightPlanType[];
  setPlans: (plans: FinishedFlightPlanType[]) => void;
  setSelectedPlanIds: (ids: number[]) => void;
  togglePlan: (id: number) => void;
}>((set) => ({
  dateFrom: "",
  dateTo: "",
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
  selectedPlanIds: [],
  plans: [],
  setPlans: (plans) => set({ plans }),
  setSelectedPlanIds: (ids) => set({ selectedPlanIds: ids }),
  togglePlan: (id) =>
    set((s) => {
      const next = s.selectedPlanIds.includes(id)
        ? s.selectedPlanIds.filter((x) => x !== id)
        : [...s.selectedPlanIds, id];
      return { selectedPlanIds: next };
    }),
}));
