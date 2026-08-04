import { FlightPlanType } from "Types";
import { create } from "zustand";

interface DeleteFlightPlan {
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (value: FlightPlanType[]) => void;

  filterTerm: string;
  setFilterTerm: (value: string) => void;

  openDeleteModal: boolean;
  setOpenDeleteModal: (value: boolean) => void;
}

export const useDeleteFlightPlan = create<DeleteFlightPlan>((set) => ({
  selectedPlan: null,
  setSelectedPlan: (value) => set({ selectedPlan: value }),

  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),

  filteredPlans: [],
  setFilteredPlans: (value) => set({ filteredPlans: value }),

  filterTerm: "",
  setFilterTerm: (value) => set({ filterTerm: value }),

  openDeleteModal: false,
  setOpenDeleteModal: (value) => set({ openDeleteModal: value }),
}));
