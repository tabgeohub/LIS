import type { PointPlanImageRow } from "api-hooks/planImages";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import { pointPlanImagesToAttachments } from "api-hooks/planImages";
import type { FinishedFlightPlanType } from "Types/finished_plans";

type ImageHookResult = {
  images: PointPlanImageRow[];
  loading: boolean;
  error: string | null;
};

export type BuildTimesliderPageViewInput = {
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

export function buildFirstImageUrlByPlanId(imageRows: PointPlanImageRow[]) {
  const urls: Record<number, string> = {};
  for (const row of imageRows) {
    if (!urls[row.plan_id] && row.url) {
      urls[row.plan_id] = attachmentDisplayUrl(row.url);
    }
  }
  return urls;
}

export function resolveTimesliderPlanEmptyFlags(input: {
  ok: boolean;
  plansLoading: boolean;
  plansError: string | null;
  allPlansLength: number;
  filteredPlansLength: number;
}) {
  return {
    noPlansInRange:
      input.ok &&
      !input.plansLoading &&
      !input.plansError &&
      input.allPlansLength === 0,
    noMatchingPlans:
      input.ok &&
      !input.plansLoading &&
      !input.plansError &&
      input.allPlansLength > 0 &&
      input.filteredPlansLength === 0,
  };
}

export function resolveTimesliderActiveImages(input: {
  kind: "point" | "geometry";
  selectedPlan: FinishedFlightPlanType | null;
  pointResult: ImageHookResult;
  geometryResult: ImageHookResult;
}) {
  const activeImageResult =
    input.kind === "point" ? input.pointResult : input.geometryResult;
  const imageRows = activeImageResult.images;
  const rowsForSelectedPlan = input.selectedPlan
    ? imageRows.filter((row) => row.plan_id === input.selectedPlan!.id)
    : [];

  return {
    imageRows,
    images: pointPlanImagesToAttachments(rowsForSelectedPlan),
    imagesLoading: activeImageResult.loading,
    imagesError: activeImageResult.error,
  };
}
