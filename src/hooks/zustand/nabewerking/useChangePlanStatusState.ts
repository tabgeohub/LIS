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

export const useChangePlanStatusState = create<ChangePlanStatusState>(
  (set) => ({
    step: 1,
    setStep: (value) => set({ step: value }),

    selectedPlan: null,
    setSelectedPlan: (value) => set({ selectedPlan: value }),

    selectedPoints: [],
    setSelectedPoints: (value) => set({ selectedPoints: value }),

    filteredPlans: [],
    setFilteredPlans: (value) => set({ filteredPlans: value }),

    openFilter: false,
    setOpenFilter: (value) => set({ openFilter: value }),

    filterTerm: "",
    setFilterTerm: (value) => set({ filterTerm: value }),

    periode: "alle",
    setPeriode: (value) => set({ periode: value }),

    dateFrom: "",
    setDateFrom: (value) => set({ dateFrom: value }),

    dateTo: "",
    setDateTo: (value) => set({ dateTo: value }),

    clear: () =>
      set({
        step: 1,
        setStep: (value) => set({ step: value }),

        selectedPlan: null,
        setSelectedPlan: (value) => set({ selectedPlan: value }),

        selectedPoints: [],
        setSelectedPoints: (value) => set({ selectedPoints: value }),

        openFilter: false,
        setOpenFilter: (value) => set({ openFilter: value }),

        periode: "alle",
        setPeriode: (value) => set({ periode: value }),

        dateFrom: "",
        setDateFrom: (value) => set({ dateFrom: value }),

        dateTo: "",
        setDateTo: (value) => set({ dateTo: value }),
      }),
  })
);
