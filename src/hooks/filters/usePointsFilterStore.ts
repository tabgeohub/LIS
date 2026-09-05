import { create } from "zustand";
import {
  createFilterStoreSetters,
  emptyFilterStoreValues,
  FilterStoreSetters,
  FilterStoreValues,
} from "./filterStoreState";

export type { PeriodType } from "./filterStoreState";

interface PointsFilterState extends FilterStoreValues, FilterStoreSetters {
  activityFilter: string;
  setActivityFilter: (value: string) => void;
  resetFilters: () => void;
}

export const usePointsFilterStore = create<PointsFilterState>((set) => ({
  ...emptyFilterStoreValues,
  ...createFilterStoreSetters(set),
  activityFilter: "",
  setActivityFilter: (value) => set({ activityFilter: value }),
  resetFilters: () => set({ ...emptyFilterStoreValues, activityFilter: "" }),
}));
