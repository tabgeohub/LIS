import { useMemo } from "react";
import { useTimesliderState } from "hooks/zustand/ui/useTimesliderState";
import { usePublishTimesliderRange } from "./useTimesliderEffects";
import { useTimesliderRangeResets } from "./useTimesliderRangeResets";
import type { useTimesliderRangeState } from "./useTimesliderRangeState";

type RangeState = ReturnType<typeof useTimesliderRangeState>;

export function useTimesliderRangeDates(s: RangeState) {
  useTimesliderRangeResets(s);
  const dateFrom = useMemo(
    () => s.stepIndexToDate(s.safeValues[0]),
    [s.safeValues[0], s.stepIndexToDate]
  );
  const dateTo = useMemo(
    () => s.stepIndexToDate(s.safeValues[1]),
    [s.safeValues[1], s.stepIndexToDate]
  );
  const { setDateRange } = useTimesliderState();
  usePublishTimesliderRange({ dateFrom, dateTo, setDateRange });
  return { dateFrom, dateTo };
}
