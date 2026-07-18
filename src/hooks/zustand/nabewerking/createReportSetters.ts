import {
  createPeriodFilterSetters,
} from "hooks/zustand/shared/periodFilterState";
import type { CreateReportState } from "./createReportStateTypes";
import { createReportClearState } from "./createReportClearState";

export function createReportSetters(
  set: (partial: Partial<CreateReportState>) => void
) {
  return {
    setStep: (value: number) => set({ step: value }),
    setSelectedPlan: (value: CreateReportState["selectedPlan"]) =>
      set({ selectedPlan: value }),
    setSelectedPoints: (value: number[]) => set({ selectedPoints: value }),
    setSelectedGeometries: (value: number[]) =>
      set({ selectedGeometries: value }),
    setFilteredPlans: (value: CreateReportState["filteredPlans"]) =>
      set({ filteredPlans: value }),
    setOpenFilter: (value: boolean) => set({ openFilter: value }),
    setFilterTerm: (value: string) => set({ filterTerm: value }),
    setZipFile: (value: Blob | null) => set({ zipFile: value }),
    setZippingStatus: (value: string) => set({ zippingStatus: value }),
    ...createPeriodFilterSetters(set),
    clear: () => set(createReportClearState()),
  };
}
