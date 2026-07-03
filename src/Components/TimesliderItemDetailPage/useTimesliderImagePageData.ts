import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import {
  filterFinishedPlansContainingItem,
  getItemDisplayTitle,
} from "@helpers/timeslider";
import { usePointPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/usePointPlanImages";
import { useGeometryPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/useGeometryPlanImages";
import { parseTimesliderImageQuery } from "./parseTimesliderImageQuery";
import { useTimesliderPlansFetch } from "./useTimesliderPlansFetch";
import {
  useClampedImageIndex,
  useTimesliderSelectedPlan,
} from "./useTimesliderSelection";
import { buildTimesliderPageView } from "./buildTimesliderPageView";

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

  const plansFetch = useTimesliderPlansFetch({
    enabled: ok,
    regioId,
    from,
    to,
  });

  const filteredPlans = useMemo(
    () =>
      ok
        ? filterFinishedPlansContainingItem(plansFetch.plans, kind, itemId)
        : [],
    [plansFetch.plans, ok, kind, itemId]
  );

  const planIds = useMemo(
    () => filteredPlans.map((plan) => plan.id),
    [filteredPlans]
  );

  const displayTitle = useMemo(
    () =>
      ok
        ? getItemDisplayTitle(
            filteredPlans.length ? filteredPlans : plansFetch.plans,
            kind,
            itemId
          )
        : "",
    [ok, filteredPlans, plansFetch.plans, kind, itemId]
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

  const { selectedPlan, setSelectedPlan } = useTimesliderSelectedPlan({
    filteredPlans,
    planIdFromQuery,
  });

  const rowsForSelectedPlan = useMemo(() => {
    if (!selectedPlan) return [];
    const imageRows =
      kind === "point" ? pointResult.images : geometryResult.images;
    return imageRows.filter((row) => row.plan_id === selectedPlan.id);
  }, [selectedPlan, kind, pointResult.images, geometryResult.images]);

  const { selectedIndex, setSelectedIndex } = useClampedImageIndex(
    rowsForSelectedPlan.length
  );

  const view = buildTimesliderPageView({
    ok,
    kind,
    itemId,
    from,
    to,
    displayTitle,
    filteredPlans,
    allPlans: plansFetch.plans,
    selectedPlan,
    planIds,
    pointResult,
    geometryResult,
    plansLoading: plansFetch.loading,
    plansError: plansFetch.error,
    needsAuth: ok && !user?.role,
    queryReason: ok ? "" : parsed.reason,
  });

  return {
    ...view,
    selectedPlan,
    setSelectedPlan,
    selectedIndex,
    setSelectedIndex,
  };
}
