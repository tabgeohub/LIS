import { useTimesliderImagePagePlanList } from "./useTimesliderImagePagePlanList";
import { useTimesliderImagePageSelection } from "./useTimesliderImagePageSelection";
import type { useTimesliderQueryContext } from "./useTimesliderQueryContext";

type Query = ReturnType<typeof useTimesliderQueryContext>;

export function useTimesliderImagePagePlans(query: Query) {
  const planList = useTimesliderImagePagePlanList(query);
  const selection = useTimesliderImagePageSelection(query, planList);
  return { ...planList, ...selection };
}
