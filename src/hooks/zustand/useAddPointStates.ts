import { EnrichedPointType, FlightPlanType } from "Types";
import { create } from "zustand";

interface AddPointToFlightPlanState {
  step: number;
  setStep: (value: number) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  selectedPoints2: number[];
  setSelectedPoints2: (value: number[]) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filteredPoints: EnrichedPointType[];
  setFilteredPoints: (value: EnrichedPointType[]) => void;

  clear: () => void;
}

export const useAddPointStates = create<AddPointToFlightPlanState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  selectedPoints: [],
  setSelectedPoints: (value) => set({ selectedPoints: value }),

  selectedPoints2: [],
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),

  selectedPlan: null,
  setSelectedPlan: (value) => set({ selectedPlan: value }),

  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),

  filteredPoints: [],
  setFilteredPoints: (value) => set({ filteredPoints: value }),

  clear: () =>
    set({
      step: 1,
      setStep: (value) => set({ step: value }),

      selectedPlan: null,
      setSelectedPlan: (value) => set({ selectedPlan: value }),

      openFilter: false,
      setOpenFilter: (value) => set({ openFilter: value }),

      filteredPoints: [],
      setFilteredPoints: (value) => set({ filteredPoints: value }),

      selectedPoints: [],
      setSelectedPoints: (value) => set({ selectedPoints: value }),

      selectedPoints2: [],
      setSelectedPoints2: (value) => set({ selectedPoints2: value }),
    }),
}));
