import type { FinishedFlightPlanType } from "Types/finished_plans";
import type { AttachmentType } from "Types/finished_plans";

export type TimesliderImagePageDataSlice = {
  queryError: string | null;
  invalidQuery: boolean;
  from: string;
  to: string;
  displayTitle: string;
  filteredPlans: FinishedFlightPlanType[];
  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (plan: FinishedFlightPlanType | null) => void;
  allPlansLoading: boolean;
  plansError: string | null;
  needsAuth: boolean;
  images: AttachmentType[];
  imagesLoading: boolean;
  imagesError: string | null;
  selectedIndex: number;
  setSelectedIndex: (value: number | ((prev: number) => number)) => void;
  noPlansInRange: boolean;
  noMatchingPlans: boolean;
  firstImageUrlByPlanId: Record<number, string>;
};

export type BuildTimesliderPageShellInput = {
  data: TimesliderImagePageDataSlice;
  plansSectionVisible: boolean;
  setPlansSectionVisible: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
  galleryOpen: boolean;
  setGalleryOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
};
