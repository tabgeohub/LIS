import { create } from "zustand";
import {
  createFilterStoreSetters,
  emptyFilterStoreValues,
  FilterStoreSetters,
  FilterStoreValues,
} from "./filterStoreState";

export type { PeriodType } from "./filterStoreState";

interface PlansFilterState extends FilterStoreValues, FilterStoreSetters {
  resetFilters: () => void;
}

export const usePlansFilterStore = create<PlansFilterState>((set) => ({
  ...emptyFilterStoreValues,
  ...createFilterStoreSetters(set),
  resetFilters: () => set(emptyFilterStoreValues),
}));
