import { FinishedFlightPlanType } from "Types/finished_plans";
import { emptyPeriodFilter } from "hooks/zustand/shared/periodFilterState";

export { type CreateReportState } from "./createReportStateTypes";

export const createReportInitialState = {
  step: 1,
  selectedPlan: null as FinishedFlightPlanType | null,
  selectedPoints: [] as number[],
  selectedGeometries: [] as number[],
  filteredPlans: [] as FinishedFlightPlanType[],
  openFilter: false,
  filterTerm: "",
  zipFile: null as Blob | null,
  zippingStatus: "",
  ...emptyPeriodFilter,
};
