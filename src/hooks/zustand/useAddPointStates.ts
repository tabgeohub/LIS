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

const initialState = {
  step: 1,
  selectedPoints: [] as number[],
  selectedPoints2: [] as number[],
  selectedPlan: null as FlightPlanType | null,
  openFilter: false,
  filteredPoints: [] as EnrichedPointType[],
};

export const useAddPointStates = create<AddPointToFlightPlanState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setOpenFilter: (value) => set({ openFilter: value }),
  setFilteredPoints: (value) => set({ filteredPoints: value }),
  clear: () => set(initialState),
}));
