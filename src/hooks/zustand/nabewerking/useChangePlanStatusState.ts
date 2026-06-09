import { FlightPlanType } from "Types";

import { create } from "zustand";

interface ChangePlanStatusState {
  step: number;
  setStep: (value: number) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (value: FlightPlanType[]) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filterTerm: string;
  setFilterTerm: (value: string) => void;

  periode: string;
  setPeriode: (value: string) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;

  dateTo: string;
  setDateTo: (value: string) => void;

  clear: () => void;
}

const initialState = {
  step: 1,
  selectedPlan: null as FlightPlanType | null,
  selectedPoints: [] as number[],
  filteredPlans: [] as FlightPlanType[],
  openFilter: false,
  filterTerm: "",
  periode: "alle",
  dateFrom: "",
  dateTo: "",
};

/** Subset reset when leaving the wizard (preserves filteredPlans, filterTerm). */
const clearState = {
  step: initialState.step,
  selectedPlan: initialState.selectedPlan,
  selectedPoints: initialState.selectedPoints,
  openFilter: initialState.openFilter,
  periode: initialState.periode,
  dateFrom: initialState.dateFrom,
  dateTo: initialState.dateTo,
};

export const useChangePlanStatusState = create<ChangePlanStatusState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setFilteredPlans: (value) => set({ filteredPlans: value }),
  setOpenFilter: (value) => set({ openFilter: value }),
  setFilterTerm: (value) => set({ filterTerm: value }),
  setPeriode: (value) => set({ periode: value }),
  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
  clear: () => set(clearState),
}));
