export type PlanListFilterValues = {
  openFilter: boolean;
  filterTerm: string;
};

export const emptyPlanListFilter: PlanListFilterValues = {
  openFilter: false,
  filterTerm: "",
};

export type PlanListFilterSetters = {
  setOpenFilter: (value: boolean) => void;
  setFilterTerm: (value: string) => void;
};

export function createPlanListFilterSetters(
  set: (partial: Partial<PlanListFilterValues>) => void
): PlanListFilterSetters {
  return {
    setOpenFilter: (value) => set({ openFilter: value }),
    setFilterTerm: (value) => set({ filterTerm: value }),
  };
}
