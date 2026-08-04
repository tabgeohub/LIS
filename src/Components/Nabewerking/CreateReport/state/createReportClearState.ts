import { createReportInitialState } from "./createReportStateValues";

/** Subset reset when leaving the wizard (preserves filteredPlans, filterTerm, zip). */
export function createReportClearState() {
  return {
    step: createReportInitialState.step,
    selectedPlan: createReportInitialState.selectedPlan,
    selectedPoints: createReportInitialState.selectedPoints,
    selectedGeometries: createReportInitialState.selectedGeometries,
    openFilter: createReportInitialState.openFilter,
    periode: createReportInitialState.periode,
    dateFrom: createReportInitialState.dateFrom,
    dateTo: createReportInitialState.dateTo,
  };
}
