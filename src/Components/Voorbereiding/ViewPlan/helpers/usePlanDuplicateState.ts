import { FlightPlanType } from "Types";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSettersWithZeroPassagiers,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
  viewPlanFlightPlanFormDefaults,
} from "hooks/zustand/shared/flightPlanFormFields";

type PlanDuplicateMetaValues = {
  vluchtnummer: string;
  aanmaker: string;
  aanmaaldatum: string;
  basemap: string;
  layers: string;
  status: string;
};

type PlanDuplicateMetaSetters = {
  setVluchtnummer: (value: string) => void;
  setAanmaker: (value: string) => void;
  setAanmaaldatum: (value: string) => void;
  setBasemap: (value: string) => void;
  setLayers: (value: string) => void;
  setStatus: (value: string) => void;
};

function createPlanDuplicateMetaSetters(
  set: (partial: Partial<PlanDuplicateMetaValues>) => void
): PlanDuplicateMetaSetters {
  return {
    setVluchtnummer: (value) => set({ vluchtnummer: value }),
    setAanmaker: (value) => set({ aanmaker: value }),
    setAanmaaldatum: (value) => set({ aanmaaldatum: value }),
    setBasemap: (value) => set({ basemap: value }),
    setLayers: (value) => set({ layers: value }),
    setStatus: (value) => set({ status: value }),
  };
}

const emptyPlanDuplicateMeta: PlanDuplicateMetaValues = {
  vluchtnummer: "",
  aanmaker: "",
  aanmaaldatum: "",
  basemap: "",
  layers: "",
  status: "",
};

interface PlanDuplicateState
  extends FlightPlanFormFieldValues,
    FlightPlanFormFieldSetters,
    PlanDuplicateMetaValues,
    PlanDuplicateMetaSetters {
  duplicatedFlightPlan: FlightPlanType | null;
  setDuplicatedFlightPlan: (duplicatedFlightPlan: FlightPlanType) => void;
}

export const usePlanDuplicateState = create<PlanDuplicateState>((set) => ({
  duplicatedFlightPlan: null,
  setDuplicatedFlightPlan: (duplicatedFlightPlan) =>
    set({ duplicatedFlightPlan }),

  ...emptyPlanDuplicateMeta,
  ...createPlanDuplicateMetaSetters(set),

  ...viewPlanFlightPlanFormDefaults,
  ...createFlightPlanFormFieldSettersWithZeroPassagiers(set),
}));
