import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import {
  filterFinishedPlansContainingItem,
  getItemDisplayTitle,
} from "@helpers/timeslider";
import { parseTimesliderImageQuery } from "./parseTimesliderImageQuery";
import { useTimesliderPlansFetch } from "./useTimesliderPlansFetch";
import {
  useClampedImageIndex,
  useTimesliderSelectedPlan,
} from "./useTimesliderSelection";
import { buildTimesliderPageView } from "./buildTimesliderPageView";
import { useTimesliderItemImages } from "./useTimesliderItemImages";

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
        ? filterFinishedPlansContainingItem({
            plans: plansFetch.plans,
            kind,
            itemId,
          })
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
        ? getItemDisplayTitle({
            plans: filteredPlans.length ? filteredPlans : plansFetch.plans,
            kind,
            itemId,
          })
        : "",
    [ok, filteredPlans, plansFetch.plans, kind, itemId]
  );

  const { selectedPlan, setSelectedPlan } = useTimesliderSelectedPlan({
    filteredPlans,
    planIdFromQuery,
  });

  const { pointResult, geometryResult, rowsForSelectedPlan } =
    useTimesliderItemImages({
      ok,
      kind,
      itemId,
      planIds,
      regioId,
      selectedPlan,
    });

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
