import type { FinishedFlightPlanType } from "Types/finished_plans";

/** Shared plan-filter props for PlansFilterSection + TimesliderPlansOverlay. */
export type PlansFilterSectionProps = {
  plans: FinishedFlightPlanType[];
  selectedPlanId: number | null;
  onSelectPlan: (plan: FinishedFlightPlanType) => void;
  loading: boolean;
  emptyHint?: string;
  /** First preview image URL per plan id for this item (point/geometry). */
  firstImageUrlByPlanId: Record<number, string>;
  imagesLoading: boolean;
};
