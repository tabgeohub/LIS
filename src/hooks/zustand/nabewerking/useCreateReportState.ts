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

const initialState = {
  step: 1,
  selectedPlan: null as FinishedFlightPlanType | null,
  selectedPoints: [] as number[],
  selectedGeometries: [] as number[],
  filteredPlans: [] as FinishedFlightPlanType[],
  openFilter: false,
  filterTerm: "",
  zipFile: null as Blob | null,
  zippingStatus: "",
  periode: "alle",
  dateFrom: "",
  dateTo: "",
};

/** Subset reset when leaving the wizard (preserves filteredPlans, filterTerm, zip). */
const clearState = {
  step: initialState.step,
  selectedPlan: initialState.selectedPlan,
  selectedPoints: initialState.selectedPoints,
  selectedGeometries: initialState.selectedGeometries,
  openFilter: initialState.openFilter,
  periode: initialState.periode,
  dateFrom: initialState.dateFrom,
  dateTo: initialState.dateTo,
};

export const useCreateReportState = create<CreateReportState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setSelectedGeometries: (value) => set({ selectedGeometries: value }),
  setFilteredPlans: (value) => set({ filteredPlans: value }),
  setOpenFilter: (value) => set({ openFilter: value }),
  setFilterTerm: (value) => set({ filterTerm: value }),
  setZipFile: (value) => set({ zipFile: value }),
  setZippingStatus: (value) => set({ zippingStatus: value }),
  setPeriode: (value) => set({ periode: value }),
  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
  clear: () => set(clearState),
}));
