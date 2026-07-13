import { useTimesliderPlansFetch } from "./useTimesliderPlansFetch";
import {
  useClampedImageIndex,
  useTimesliderSelectedPlan,
} from "./useTimesliderSelection";
import { buildTimesliderPageView } from "./buildTimesliderPageView";
import { useTimesliderItemImages } from "./useTimesliderItemImages";
import { useTimesliderQueryContext } from "./useTimesliderQueryContext";
import { useTimesliderDerivedPlans } from "./useTimesliderDerivedPlans";

export function useTimesliderImagePageData() {
  const query = useTimesliderQueryContext();

  const plansFetch = useTimesliderPlansFetch({
    enabled: query.ok,
    regioId: query.regioId,
    from: query.from,
    to: query.to,
  });

  const { filteredPlans, planIds, displayTitle } = useTimesliderDerivedPlans({
    ok: query.ok,
    plans: plansFetch.plans,
    kind: query.kind,
    itemId: query.itemId,
  });

  const { selectedPlan, setSelectedPlan } = useTimesliderSelectedPlan({
    filteredPlans,
    planIdFromQuery: query.planIdFromQuery,
  });

  const { pointResult, geometryResult, rowsForSelectedPlan } =
    useTimesliderItemImages({
      ok: query.ok,
      kind: query.kind,
      itemId: query.itemId,
      planIds,
      regioId: query.regioId,
      selectedPlan,
    });

  const { selectedIndex, setSelectedIndex } = useClampedImageIndex(
    rowsForSelectedPlan.length
  );

  const view = buildTimesliderPageView({
    ok: query.ok,
    kind: query.kind,
    itemId: query.itemId,
    from: query.from,
    to: query.to,
    displayTitle,
    filteredPlans,
    allPlans: plansFetch.plans,
    selectedPlan,
    planIds,
    pointResult,
    geometryResult,
    plansLoading: plansFetch.loading,
    plansError: plansFetch.error,
    needsAuth: query.needsAuth,
    queryReason: query.queryReason,
  });

  return {
    ...view,
    selectedPlan,
    setSelectedPlan,
    selectedIndex,
    setSelectedIndex,
  };
}
