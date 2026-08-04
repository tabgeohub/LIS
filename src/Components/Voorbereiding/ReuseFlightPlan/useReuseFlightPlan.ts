import { EnrichedPointType, FlightPlanType } from "Types";
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
import {
  createPlanWizardCoreSetters,
  emptyPlanWizardCore,
  PlanWizardCoreSetters,
  PlanWizardCoreValues,
} from "hooks/zustand/shared/planWizardCore";

interface ReUseFlightPlanState
  extends FlightPlanFormFieldValues,
    PlanListFilterValues,
    FlightPlanFormFieldSetters,
    PlanListFilterSetters,
    PlanWizardCoreValues<FlightPlanType, EnrichedPointType>,
    PlanWizardCoreSetters<FlightPlanType, EnrichedPointType> {
  currentPoints: number[];
  setCurrentPoints: (value: number[]) => void;

  currentGeometries: number[];
  setCurrentGeometries: (value: number[]) => void;

  newPoints: number[];
  setNewPoints: (value: number[]) => void;

  newGeometries: number[];
  setNewGeometries: (value: number[]) => void;

  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;

  clear: () => void;
}

const initialState = {
  ...emptyPlanWizardCore<FlightPlanType, EnrichedPointType>(),
  currentPoints: [] as number[],
  currentGeometries: [] as number[],
  newPoints: [] as number[],
  newGeometries: [] as number[],
  vluchtnummer: "",
  ...emptyPlanListFilter,
  ...emptyFlightPlanFormFields,
};

export const useReuseFlightPlan = create<ReUseFlightPlanState>((set) => ({
  ...initialState,
  ...createPlanWizardCoreSetters(set),
  setCurrentPoints: (value) => set({ currentPoints: value }),
  setCurrentGeometries: (value) => set({ currentGeometries: value }),
  setNewPoints: (value) => set({ newPoints: value }),
  setNewGeometries: (value) => set({ newGeometries: value }),
  setVluchtnummer: (value) => set({ vluchtnummer: value }),
  ...createFlightPlanFormFieldSetters(set),
  ...createPlanListFilterSetters(set),
  clear: () => set(initialState),
}));
