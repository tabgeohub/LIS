import {
  buildFirstImageUrlByPlanId,
  resolveTimesliderActiveImages,
  resolveTimesliderPlanEmptyFlags,
  type BuildTimesliderPageViewInput,
} from "./buildTimesliderPageViewParts";

export type { BuildTimesliderPageViewInput } from "./buildTimesliderPageViewParts";

export function buildTimesliderPageView(input: BuildTimesliderPageViewInput) {
  const { imageRows, images, imagesLoading, imagesError } =
    resolveTimesliderActiveImages({
      kind: input.kind,
      selectedPlan: input.selectedPlan,
      pointResult: input.pointResult,
      geometryResult: input.geometryResult,
    });

  const emptyFlags = resolveTimesliderPlanEmptyFlags({
    ok: input.ok,
    plansLoading: input.plansLoading,
    plansError: input.plansError,
    allPlansLength: input.allPlans.length,
    filteredPlansLength: input.filteredPlans.length,
  });

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
    firstImageUrlByPlanId: buildFirstImageUrlByPlanId(imageRows),
    imagesLoading,
    imagesError,
    ...emptyFlags,
  };
}
