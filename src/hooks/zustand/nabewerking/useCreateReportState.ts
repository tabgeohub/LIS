import { FinishedFlightPlanType } from "Types/finished_plans";

import { create } from "zustand";

interface CreateReportState {
  step: number;
  setStep: (value: number) => void;

  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;

  filteredPlans: FinishedFlightPlanType[];
  setFilteredPlans: (value: FinishedFlightPlanType[]) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filterTerm: string;
  setFilterTerm: (value: string) => void;

  zipFile: Blob | null;
  setZipFile: (value: Blob | null) => void;

  zippingStatus: string;
  setZippingStatus: (value: string) => void;

  periode: string;
  setPeriode: (value: string) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;

  dateTo: string;
  setDateTo: (value: string) => void;

  clear: () => void;
}

export const useCreateReportState = create<CreateReportState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  selectedPlan: null,
  setSelectedPlan: (value) => set({ selectedPlan: value }),

  selectedPoints: [],
  setSelectedPoints: (value) => set({ selectedPoints: value }),

  selectedGeometries: [],
  setSelectedGeometries: (value) => set({ selectedGeometries: value }),

  filteredPlans: [],
  setFilteredPlans: (value) => set({ filteredPlans: value }),

  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),

  filterTerm: "",
  setFilterTerm: (value) => set({ filterTerm: value }),

  zipFile: null,
  setZipFile: (value) => set({ zipFile: value }),

  zippingStatus: "",
  setZippingStatus: (value) => set({ zippingStatus: value }),

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

      selectedGeometries: [],
      setSelectedGeometries: (value) => set({ selectedGeometries: value }),

      openFilter: false,
      setOpenFilter: (value) => set({ openFilter: value }),

      periode: "alle",
      setPeriode: (value) => set({ periode: value }),

      dateFrom: "",
      setDateFrom: (value) => set({ dateFrom: value }),

      dateTo: "",
      setDateTo: (value) => set({ dateTo: value }),
    }),
}));
