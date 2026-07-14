import { useMemo, useState } from "react";
import { useTimeRange } from "hooks/useTimeRange";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";

import {
  createTimesliderConversions,
  normalizeSliderValues,
  parseTimesliderRange,
  SLIDER_PARTS,
} from "./timesliderRangeHelpers";
import { useTimesliderInputHandlers } from "./useTimesliderInputHandlers";
import {
  useClearTimesliderOrderHint,
  usePublishTimesliderRange,
  useResetTimesliderRange,
} from "./useTimesliderEffects";

export { SLIDER_PARTS } from "./timesliderRangeHelpers";

export function useTimesliderRange(regioId: string | undefined) {
  const { range, loading } = useTimeRange(regioId);

  const { minDate, maxDate } = useMemo(
    () => parseTimesliderRange(range.from, range.to),
    [range.from, range.to]
  );

  const maxStep = SLIDER_PARTS;
  const { stepIndexToDate, dateToStepIndex } = useMemo(
    () => createTimesliderConversions(minDate, maxDate, maxStep),
    [minDate, maxDate, maxStep]
  );

  const [values, setValues] = useState<[number, number]>(() => [0, maxStep]);
  const [orderHint, setOrderHint] = useState<string | null>(null);

  useResetTimesliderRange({ maxStep, ...range, setValues });
  useClearTimesliderOrderHint({ orderHint, setOrderHint });

  const safeValues = useMemo(
    () => normalizeSliderValues(values, maxStep),
    [values, maxStep]
  );

  const dateFrom = useMemo(
    () => stepIndexToDate(safeValues[0]),
    [safeValues[0], stepIndexToDate]
  );
  const dateTo = useMemo(
    () => stepIndexToDate(safeValues[1]),
    [safeValues[1], stepIndexToDate]
  );

  const { setDateRange } = useTimesliderState();
  usePublishTimesliderRange({ dateFrom, dateTo, setDateRange });

  const handlers = useTimesliderInputHandlers({
    dateFrom,
    dateTo,
    safeValues,
    maxStep,
    dateToStepIndex,
    setValues,
    setOrderHint,
  });

  return {
    loading,
    maxStep,
    safeValues,
    dateFrom,
    dateTo,
    orderHint,
    ...handlers,
  };
}
