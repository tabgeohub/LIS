import { create } from "zustand";
import {
  createFlightPlanFormFieldSetters,
  emptyFlightPlanFormFields,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import {
  createPlanContentSelectionSetters,
  emptyPlanContentSelection,
  PlanContentSelectionSetters,
  PlanContentSelectionValues,
} from "hooks/zustand/shared/planContentSelectionState";

interface FlightPlanState
  extends FlightPlanFormFieldValues,
    FlightPlanFormFieldSetters,
    PlanContentSelectionValues,
    PlanContentSelectionSetters {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  clear: () => void;
}

const initialState = {
  vluchtnummer: "",
  ...emptyFlightPlanFormFields,
  geplandeVliegduur: "0:00",
  aantalPassagiers: null as number | null,
  ...emptyPlanContentSelection,
};

export const useFlightPlanState = create<FlightPlanState>((set) => ({
  ...initialState,
  setVluchtnummer: (value) => set({ vluchtnummer: value }),
  ...createFlightPlanFormFieldSetters(set),
  ...createPlanContentSelectionSetters(set),
  clear: () => set(initialState),
}));
