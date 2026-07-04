export type PeriodFilterValues = {
  periode: string;
  dateFrom: string;
  dateTo: string;
};

export const emptyPeriodFilter: PeriodFilterValues = {
  periode: "alle",
  dateFrom: "",
  dateTo: "",
};

export type PeriodFilterSetters = {
  setPeriode: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
};

export function createPeriodFilterSetters(
  set: (partial: Partial<PeriodFilterValues>) => void
): PeriodFilterSetters {
  return {
    setPeriode: (value) => set({ periode: value }),
    setDateFrom: (value) => set({ dateFrom: value }),
    setDateTo: (value) => set({ dateTo: value }),
  };
}
