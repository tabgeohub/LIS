import type { FinishedFlightPlanType } from "Types/finished_plans";
import type { AttachmentType } from "Types/finished_plans";
import {
  buildImageNavigation,
  buildTimesliderPageStatus,
} from "./timesliderPageStatus";

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

/** Derive page shell props from image-page data + local UI state. */
export function buildTimesliderPageShell(input: {
  data: TimesliderImagePageDataSlice;
  plansSectionVisible: boolean;
  setPlansSectionVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  galleryOpen: boolean;
  setGalleryOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const { data } = input;
  const {
    queryError,
    invalidQuery,
    from,
    to,
    displayTitle,
    filteredPlans,
    selectedPlan,
    setSelectedPlan,
    allPlansLoading,
    plansError,
    needsAuth,
    images,
    imagesLoading,
    imagesError,
    selectedIndex,
    setSelectedIndex,
    noPlansInRange,
    noMatchingPlans,
    firstImageUrlByPlanId,
  } = data;

  const { blockImages, plansEmptyHint, emptyMain } = buildTimesliderPageStatus({
    invalidQuery,
    queryError,
    needsAuth,
    plansError,
    noPlansInRange,
    noMatchingPlans,
    allPlansLoading,
    imagesLoading,
    imagesLength: images.length,
  });

  const { safeIndex, imageNav } = buildImageNavigation({
    blockImages,
    imagesLength: images.length,
    selectedIndex,
    setSelectedIndex,
  });

  return {
    header: {
      itemName: invalidQuery ? queryError ?? "Ongeldige link" : displayTitle || "—",
      vluchtnummer: invalidQuery ? null : (selectedPlan?.vluchtnummer ?? null),
      dateFrom: from,
      dateTo: to,
      onAllPlansClick: () =>
        input.setPlansSectionVisible((visible) => !visible),
    },
    plansOverlay: {
      visible: input.plansSectionVisible,
      blocked: invalidQuery || needsAuth || Boolean(plansError),
      plans: filteredPlans,
      selectedPlanId: selectedPlan?.id ?? null,
      onSelectPlan: setSelectedPlan,
      loading: allPlansLoading,
      emptyHint: plansEmptyHint,
      firstImageUrlByPlanId,
      imagesLoading,
    },
    imageViewer: {
      blockImages,
      images,
      selectedAttachment:
        !blockImages && images.length > 0 ? images[safeIndex] ?? null : null,
      selectedIndex,
      safeIndex,
      setSelectedIndex,
      plansLoading: allPlansLoading,
      imagesLoading,
      imagesError,
      emptyMain,
      imageNav,
      galleryOpen: input.galleryOpen,
      onToggleGallery: () => input.setGalleryOpen((open) => !open),
    },
    needsAuth,
  };
}
