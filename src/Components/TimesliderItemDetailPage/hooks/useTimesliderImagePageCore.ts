import { useTimesliderQueryContext } from "./useTimesliderQueryContext";
import { useTimesliderImagePagePlans } from "./useTimesliderImagePagePlans";

export function useTimesliderImagePageCore() {
  const query = useTimesliderQueryContext();
  const plans = useTimesliderImagePagePlans(query);
  return { query, ...plans };
}
