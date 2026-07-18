import { useTimesliderRangeEffects } from "./useTimesliderRangeEffects";
import { useTimesliderRangeState } from "./useTimesliderRangeState";

export { SLIDER_PARTS } from "./timesliderRangeHelpers";

export function useTimesliderRange(regioId: string | undefined) {
  const s = useTimesliderRangeState(regioId);
  const { dateFrom, dateTo, handlers } = useTimesliderRangeEffects(s);
  return {
    loading: s.loading,
    maxStep: s.maxStep,
    safeValues: s.safeValues,
    dateFrom,
    dateTo,
    orderHint: s.orderHint,
    ...handlers,
  };
}
