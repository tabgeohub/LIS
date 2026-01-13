import { create } from "zustand";

export type PeriodType = "Alle" | "Laatste 4 weken" | "Periodoe van-tot";

interface PlansFilterState {
  filterText: string;
  setFilterText: (value: string) => void;

  periodFilter: PeriodType;
  setPeriodFilter: (value: PeriodType) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;

  dateTo: string;
  setDateTo: (value: string) => void;

  resetFilters: () => void;
}

export const usePlansFilterStore = create<PlansFilterState>((set) => ({
  filterText: "",
  setFilterText: (value) => set({ filterText: value }),

  periodFilter: "Alle",
  setPeriodFilter: (value) => set({ periodFilter: value }),

  dateFrom: "",
  setDateFrom: (value) => set({ dateFrom: value }),

  dateTo: "",
  setDateTo: (value) => set({ dateTo: value }),

  resetFilters: () => {
    set({
      filterText: "",
      periodFilter: "Alle",
      dateFrom: "",
      dateTo: "",
    });
  },
}));
