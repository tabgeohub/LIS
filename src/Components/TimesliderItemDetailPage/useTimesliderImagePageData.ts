import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import {
  filterFinishedPlansContainingItem,
  getItemDisplayTitle,
} from "@helpers/timeslider";
import { usePointPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/usePointPlanImages";
import { useGeometryPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/useGeometryPlanImages";
import { pointPlanImagesToAttachments } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/pointPlanImagesToAttachments";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";
import { parseTimesliderImageQuery } from "./parseTimesliderImageQuery";
import { useTimesliderPlansFetch } from "./useTimesliderPlansFetch";
import {
  useClampedImageIndex,
  useTimesliderSelectedPlan,
} from "./useTimesliderSelection";

export function useTimesliderImagePageData() {
  const [searchParams] = useSearchParams();
  const parsed = useMemo(
    () => parseTimesliderImageQuery(searchParams),
    [searchParams]
  );
  const { user } = useAuth();

  const ok = parsed.ok;
  const from = ok ? parsed.from : "";
  const to = ok ? parsed.to : "";
  const itemId = ok ? parsed.id : 0;
  const kind = ok ? parsed.kind : "point";
  const planIdFromQuery = ok ? parsed.planId : null;
  const regioId = user?.role;

  const {
    plans: allPlans,
    loading: plansLoading,
    error: plansError,
  } = useTimesliderPlansFetch({
    enabled: ok,
    regioId,
    from,
    to,
  });

  const filteredPlans = useMemo(
    () => (ok ? filterFinishedPlansContainingItem(allPlans, kind, itemId) : []),
    [allPlans, ok, kind, itemId]
  );

  const planIds = useMemo(
    () => filteredPlans.map((p) => p.id),
    [filteredPlans]
  );

  const displayTitle = useMemo(
    () =>
      ok
        ? getItemDisplayTitle(
            filteredPlans.length ? filteredPlans : allPlans,
            kind,
            itemId
          )
        : "",
    [ok, filteredPlans, allPlans, kind, itemId]
  );

  const pointResult = usePointPlanImages({
    pointId: itemId,
    planIds,
    regioId,
    enabled: ok && kind === "point" && !!regioId && planIds.length > 0,
  });

  const geometryResult = useGeometryPlanImages({
    geometryId: itemId,
    planIds,
    regioId,
    enabled: ok && kind === "geometry" && !!regioId && planIds.length > 0,
  });

  const imageRows = useMemo(() => {
    if (!ok) return [];
    return kind === "point" ? pointResult.images : geometryResult.images;
  }, [ok, kind, pointResult.images, geometryResult.images]);

  const firstImageUrlByPlanId = useMemo(() => {
    const acc: Record<number, string> = {};
    for (const row of imageRows) {
      if (acc[row.plan_id] || !row.url) continue;
      acc[row.plan_id] = attachmentDisplayUrl(row.url);
    }
    return acc;
  }, [imageRows]);

  const { selectedPlan, setSelectedPlan } = useTimesliderSelectedPlan({
    filteredPlans,
    planIdFromQuery,
  });

  const rowsForSelectedPlan = useMemo(() => {
    if (!selectedPlan) return [];
    return imageRows.filter((r) => r.plan_id === selectedPlan.id);
  }, [imageRows, selectedPlan]);

  const images = useMemo(
    () => pointPlanImagesToAttachments(rowsForSelectedPlan),
    [rowsForSelectedPlan]
  );

  const imagesLoading =
    kind === "point" ? pointResult.loading : geometryResult.loading;
  const imagesError =
    kind === "point" ? pointResult.error : geometryResult.error;

  const { selectedIndex, setSelectedIndex } = useClampedImageIndex(images.length);

  return {
    queryError: ok ? null : parsed.reason,
    invalidQuery: !ok,
    kind: ok ? kind : null,
    itemId: ok ? itemId : null,
    from,
    to,
    displayTitle,
    filteredPlans,
    selectedPlan,
    setSelectedPlan,
    planIds,
    allPlansLoading: plansLoading,
    plansError,
    needsAuth: ok && !user?.role,
    images,
    firstImageUrlByPlanId,
    imagesLoading,
    imagesError,
    selectedIndex,
    setSelectedIndex,
    noPlansInRange: ok && !plansLoading && !plansError && allPlans.length === 0,
    noMatchingPlans:
      ok &&
      !plansLoading &&
      !plansError &&
      allPlans.length > 0 &&
      filteredPlans.length === 0,
  };
}
