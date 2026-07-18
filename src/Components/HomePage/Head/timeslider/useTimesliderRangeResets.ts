import {
  useClearTimesliderOrderHint,
  useResetTimesliderRange,
} from "./useTimesliderEffects";
import type { useTimesliderRangeState } from "./useTimesliderRangeState";

type RangeState = ReturnType<typeof useTimesliderRangeState>;

export function useTimesliderRangeResets(s: RangeState) {
  useResetTimesliderRange({
    maxStep: s.maxStep,
    ...s.range,
    setValues: s.setValues,
  });
  useClearTimesliderOrderHint({
    orderHint: s.orderHint,
    setOrderHint: s.setOrderHint,
  });
}
