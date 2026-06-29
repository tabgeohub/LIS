import { FlightPlanType } from "Types";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSetters,
  emptyFlightPlanFormFields,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

interface PlanDuplicateState
  extends FlightPlanFormFieldValues,
    FlightPlanFormFieldSetters {
  duplicatedFlightPlan: FlightPlanType | null;
  setDuplicatedFlightPlan: (duplicatedFlightPlan: FlightPlanType) => void;

  vluchtnummer: string;
  setVluchtnummer: (vluchtnummer: string) => void;

  aanmaker: string;
  setAanmaker: (aanmaker: string) => void;

  aanmaaldatum: string;
  setAanmaaldatum: (aanmaaldatum: string) => void;

  basemap: string;
  setBasemap: (basemap: string) => void;

  layers: string;
  setLayers: (layers: string) => void;

  status: string;
  setStatus: (status: string) => void;
}

const duplicateFormDefaults = {
  ...emptyFlightPlanFormFields,
  geplandeVliegduur: "0:00",
  aantalPassagiers: 0 as number,
};

export const usePlanDuplicateState = create<PlanDuplicateState>((set) => ({
  duplicatedFlightPlan: null,
  setDuplicatedFlightPlan: (duplicatedFlightPlan: FlightPlanType) =>
    set(() => ({ duplicatedFlightPlan })),

  vluchtnummer: "",
  setVluchtnummer: (vluchtnummer: string) => set(() => ({ vluchtnummer })),

  aanmaker: "",
  setAanmaker: (aanmaker: string) => set(() => ({ aanmaker })),

  aanmaaldatum: "",
  setAanmaaldatum: (aanmaaldatum: string) => set(() => ({ aanmaaldatum })),

  ...duplicateFormDefaults,
  ...createFlightPlanFormFieldSetters((partial) =>
    set((state) => ({
      ...state,
      ...partial,
      aantalPassagiers:
        partial.aantalPassagiers !== undefined
          ? (partial.aantalPassagiers ?? 0)
          : state.aantalPassagiers,
    }))
  ),

  basemap: "",
  setBasemap: (basemap: string) => set(() => ({ basemap })),

  layers: "",
  setLayers: (layers: string) => set(() => ({ layers })),

  status: "",
  setStatus: (status: string) => set(() => ({ status })),
}));
