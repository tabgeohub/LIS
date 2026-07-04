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
import {
  createPeriodFilterSetters,
  emptyPeriodFilter,
  PeriodFilterSetters,
  PeriodFilterValues,
} from "hooks/zustand/shared/periodFilterState";

interface FinishedPlansState
  extends FlightPlanFormFieldValues,
    PlanListFilterValues,
    PeriodFilterValues,
    FlightPlanFormFieldSetters,
    PlanListFilterSetters,
    PeriodFilterSetters {
  step: number;
  setStep: (value: number) => void;

  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;

  filteredPoints: FinishedPointType[];
  setFilteredPoints: (value: FinishedPointType[]) => void;

  filteredPlans: FinishedFlightPlanType[];
  setFilteredPlans: (value: FinishedFlightPlanType[]) => void;

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
  ...emptyPeriodFilter,
  periode: "Alle",
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
  ...createPeriodFilterSetters(set),
  setSelectedPoint: (value) => set({ selectedPoint: value }),
  setSelectedGeometry: (value) => set({ selectedGeometry: value }),
  ...createFlightPlanFormFieldSetters(set),
  ...createPlanListFilterSetters(set),
  clear: () => set(clearState),
}));
