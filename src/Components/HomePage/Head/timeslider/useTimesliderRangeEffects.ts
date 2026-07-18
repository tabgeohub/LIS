import { useTimesliderInputHandlers } from "./useTimesliderInputHandlers";
import { useTimesliderRangeDates } from "./useTimesliderRangeDates";
import type { useTimesliderRangeState } from "./useTimesliderRangeState";

type RangeState = ReturnType<typeof useTimesliderRangeState>;

export function useTimesliderRangeEffects(s: RangeState) {
  const { dateFrom, dateTo } = useTimesliderRangeDates(s);
  const handlers = useTimesliderInputHandlers({
    dateFrom,
    dateTo,
    safeValues: s.safeValues,
    maxStep: s.maxStep,
    dateToStepIndex: s.dateToStepIndex,
    setValues: s.setValues,
    setOrderHint: s.setOrderHint,
  });
  return { dateFrom, dateTo, handlers };
}
