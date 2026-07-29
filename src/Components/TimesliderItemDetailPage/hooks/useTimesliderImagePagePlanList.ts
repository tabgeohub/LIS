import { useTimesliderPlansFetch } from "./useTimesliderPlansFetch";
import { useTimesliderDerivedPlans } from "./useTimesliderDerivedPlans";
import type { useTimesliderQueryContext } from "./useTimesliderQueryContext";

type Query = ReturnType<typeof useTimesliderQueryContext>;

export function useTimesliderImagePagePlanList(query: Query) {
  const plansFetch = useTimesliderPlansFetch({
    enabled: query.ok,
    regioId: query.regioId,
    from: query.from,
    to: query.to,
  });
  const derived = useTimesliderDerivedPlans({
    ok: query.ok,
    plans: plansFetch.plans,
    kind: query.kind,
    itemId: query.itemId,
  });
  return { plansFetch, ...derived };
}
