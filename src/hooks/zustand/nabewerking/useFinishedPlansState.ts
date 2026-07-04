import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSetters,
  createPlanListFilterSetters,
  emptyFlightPlanFormFields,
  emptyPlanListFilter,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
  PlanListFilterSetters,
  PlanListFilterValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import { createPlanWizardCoreSetters } from "hooks/zustand/shared/planWizardCore";

interface FinishedPlansState
  extends FlightPlanFormFieldValues,
    PlanListFilterValues,
    FlightPlanFormFieldSetters,
    PlanListFilterSetters {
  step: number;
  setStep: (value: number) => void;

  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;

  filteredPoints: FinishedPointType[];
  setFilteredPoints: (value: FinishedPointType[]) => void;

  filteredPlans: FinishedFlightPlanType[];
  setFilteredPlans: (value: FinishedFlightPlanType[]) => void;

  periode: string;
  setPeriode: (value: string) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;

  dateTo: string;
  setDateTo: (value: string) => void;

  selectedPoint: FinishedPointType | null;
  setSelectedPoint: (value: FinishedPointType | null) => void;

  selectedGeometry: FinishedGeometryType | null;
  setSelectedGeometry: (value: FinishedGeometryType | null) => void;

  clear: () => void;
}

const initialState = {
  step: 1,
  selectedPlan: null as FinishedFlightPlanType | null,
  filteredPoints: [] as FinishedPointType[],
  filteredPlans: [] as FinishedFlightPlanType[],
  periode: "Alle",
  dateFrom: "",
  dateTo: "",
  selectedPoint: null as FinishedPointType | null,
  selectedGeometry: null as FinishedGeometryType | null,
  ...emptyPlanListFilter,
  ...emptyFlightPlanFormFields,
};

/** Subset reset when leaving the search flow (preserves form/filter fields). */
const clearState = {
  step: initialState.step,
  selectedPlan: initialState.selectedPlan,
  openFilter: initialState.openFilter,
  filteredPoints: initialState.filteredPoints,
};

export const useFinishedPlansState = create<FinishedPlansState>((set) => ({
  ...initialState,
  ...createPlanWizardCoreSetters(set),
  setPeriode: (value) => set({ periode: value }),
  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
  setSelectedPoint: (value) => set({ selectedPoint: value }),
  setSelectedGeometry: (value) => set({ selectedGeometry: value }),
  ...createFlightPlanFormFieldSetters(set),
  ...createPlanListFilterSetters(set),
  clear: () => set(clearState),
}));
