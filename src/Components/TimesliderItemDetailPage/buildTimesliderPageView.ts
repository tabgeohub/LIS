import type { PointPlanImageRow } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/planImageTypes";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";
import { pointPlanImagesToAttachments } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/pointPlanImagesToAttachments";
import type { FinishedFlightPlanType } from "Types/finished_plans";

type ImageHookResult = {
  images: PointPlanImageRow[];
  loading: boolean;
  error: string | null;
};

type BuildTimesliderPageViewInput = {
  ok: boolean;
  kind: "point" | "geometry";
  itemId: number;
  from: string;
  to: string;
  displayTitle: string;
  filteredPlans: FinishedFlightPlanType[];
  allPlans: FinishedFlightPlanType[];
  selectedPlan: FinishedFlightPlanType | null;
  planIds: number[];
  pointResult: ImageHookResult;
  geometryResult: ImageHookResult;
  plansLoading: boolean;
  plansError: string | null;
  needsAuth: boolean;
  queryReason: string;
};

export function buildTimesliderPageView(input: BuildTimesliderPageViewInput) {
  const imageRows =
    input.kind === "point"
      ? input.pointResult.images
      : input.geometryResult.images;

  const firstImageUrlByPlanId: Record<number, string> = {};
  for (const row of imageRows) {
    if (firstImageUrlByPlanId[row.plan_id] || !row.url) continue;
    firstImageUrlByPlanId[row.plan_id] = attachmentDisplayUrl(row.url);
  }

  const rowsForSelectedPlan = input.selectedPlan
    ? imageRows.filter((row) => row.plan_id === input.selectedPlan!.id)
    : [];

  const images = pointPlanImagesToAttachments(rowsForSelectedPlan);
  const imagesLoading =
    input.kind === "point"
      ? input.pointResult.loading
      : input.geometryResult.loading;
  const imagesError =
    input.kind === "point" ? input.pointResult.error : input.geometryResult.error;

  return {
    queryError: input.ok ? null : input.queryReason,
    invalidQuery: !input.ok,
    kind: input.ok ? input.kind : null,
    itemId: input.ok ? input.itemId : null,
    from: input.from,
    to: input.to,
    displayTitle: input.displayTitle,
    filteredPlans: input.filteredPlans,
    planIds: input.planIds,
    allPlansLoading: input.plansLoading,
    plansError: input.plansError,
    needsAuth: input.needsAuth,
    images,
    firstImageUrlByPlanId,
    imagesLoading,
    imagesError,
    noPlansInRange:
      input.ok && !input.plansLoading && !input.plansError && input.allPlans.length === 0,
    noMatchingPlans:
      input.ok &&
      !input.plansLoading &&
      !input.plansError &&
      input.allPlans.length > 0 &&
      input.filteredPlans.length === 0,
  };
}
