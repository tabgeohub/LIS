import { create } from "zustand";
import {
  createPlanContentSelectionSetters,
  emptyPlanContentSelection,
  PlanContentSelectionSetters,
  PlanContentSelectionValues,
} from "hooks/zustand/shared/planContentSelectionState";

interface TemplateFlightState
  extends PlanContentSelectionValues,
    PlanContentSelectionSetters {
  clear: () => void;
}

const initialState = {
  ...emptyPlanContentSelection,
};

export const useTemplateFlightState = create<TemplateFlightState>((set) => ({
  ...initialState,
  ...createPlanContentSelectionSetters(set),
  clear: () => set(initialState),
}));
