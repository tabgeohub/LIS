import { FinishedFlightPlanType } from "Types/finished_plans";
import {
  emptyPeriodFilter,
  PeriodFilterSetters,
  PeriodFilterValues,
} from "hooks/zustand/shared/periodFilterState";

export interface CreateReportState
  extends PeriodFilterValues,
    PeriodFilterSetters {
  step: number;
  setStep: (value: number) => void;
  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  filteredPlans: FinishedFlightPlanType[];
  setFilteredPlans: (value: FinishedFlightPlanType[]) => void;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  filterTerm: string;
  setFilterTerm: (value: string) => void;
  zipFile: Blob | null;
  setZipFile: (value: Blob | null) => void;
  zippingStatus: string;
  setZippingStatus: (value: string) => void;
  clear: () => void;
}
