export type PeriodType = "Alle" | "Laatste 4 weken" | "Periodoe van-tot";

export type FilterStoreValues = {
  filterText: string;
  periodFilter: PeriodType;
  dateFrom: string;
  dateTo: string;
};

export type FilterStoreSetters = {
  setFilterText: (value: string) => void;
  setPeriodFilter: (value: PeriodType) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
};

export const emptyFilterStoreValues: FilterStoreValues = {
  filterText: "",
  periodFilter: "Alle",
  dateFrom: "",
  dateTo: "",
};

type SetFilterState = (partial: Partial<FilterStoreValues>) => void;

export function createFilterStoreSetters(set: SetFilterState): FilterStoreSetters {
  return {
    setFilterText: (value) => set({ filterText: value }),
    setPeriodFilter: (value) => set({ periodFilter: value }),
    setDateFrom: (value) => set({ dateFrom: value }),
    setDateTo: (value) => set({ dateTo: value }),
  };
}
