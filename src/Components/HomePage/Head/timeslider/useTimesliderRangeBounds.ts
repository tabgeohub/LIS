import { useMemo, useState } from "react";
import { useTimeRange } from "hooks/useTimeRange";
import {
  createTimesliderConversions,
  parseTimesliderRange,
  SLIDER_PARTS,
} from "./timesliderRangeHelpers";

export function useTimesliderRangeBounds(regioId: string | undefined) {
  const { range, loading } = useTimeRange(regioId);
  const { minDate, maxDate } = useMemo(
    () => parseTimesliderRange(range.from, range.to),
    [range.from, range.to]
  );
  const maxStep = SLIDER_PARTS;
  const conversions = useMemo(
    () => createTimesliderConversions(minDate, maxDate, maxStep),
    [minDate, maxDate, maxStep]
  );
  return { range, loading, maxStep, ...conversions };
}
