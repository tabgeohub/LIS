import { useTimesliderSelectedPlan } from "./useTimesliderSelection";
import { useTimesliderItemImages } from "./useTimesliderItemImages";
import type { useTimesliderQueryContext } from "./useTimesliderQueryContext";
import type { useTimesliderImagePagePlanList } from "./useTimesliderImagePagePlanList";

type Query = ReturnType<typeof useTimesliderQueryContext>;
type PlanList = ReturnType<typeof useTimesliderImagePagePlanList>;

export function useTimesliderImagePageSelection(
  query: Query,
  planList: PlanList
) {
  const selection = useTimesliderSelectedPlan({
    filteredPlans: planList.filteredPlans,
    planIdFromQuery: query.planIdFromQuery,
  });
  const images = useTimesliderItemImages({
    ok: query.ok,
    kind: query.kind,
    itemId: query.itemId,
    planIds: planList.planIds,
    regioId: query.regioId,
    selectedPlan: selection.selectedPlan,
  });
  return { ...selection, ...images };
}
