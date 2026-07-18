import type { BuildTimesliderPageViewInput } from "./buildTimesliderPageViewParts";
import {
  buildFirstImageUrlByPlanId,
  resolveTimesliderActiveImages,
  resolveTimesliderPlanEmptyFlags,
} from "./buildTimesliderPageViewParts";
import { timesliderPageViewScalars } from "./timesliderPageViewScalars";

export function assembleTimesliderPageView(
  input: BuildTimesliderPageViewInput
) {
  const active = resolveTimesliderActiveImages({
    kind: input.kind,
    selectedPlan: input.selectedPlan,
    pointResult: input.pointResult,
    geometryResult: input.geometryResult,
  });
  return {
    ...timesliderPageViewScalars(input),
    images: active.images,
    firstImageUrlByPlanId: buildFirstImageUrlByPlanId(active.imageRows),
    imagesLoading: active.imagesLoading,
    imagesError: active.imagesError,
    ...resolveTimesliderPlanEmptyFlags({
      ok: input.ok,
      plansLoading: input.plansLoading,
      plansError: input.plansError,
      allPlansLength: input.allPlans.length,
      filteredPlansLength: input.filteredPlans.length,
    }),
  };
}
