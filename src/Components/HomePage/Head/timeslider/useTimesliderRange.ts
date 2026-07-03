import { useCallback, useEffect, useMemo, useState } from "react";
import {
  differenceInMilliseconds,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import { useTimeRange } from "hooks/useTimeRange";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";

const FALLBACK_MIN = new Date(2024, 0, 1);
const FALLBACK_MAX = new Date(2025, 11, 31);
export const SLIDER_PARTS = 10;

function clampToStepIndex(stepIndex: number, stepCount: number): number {
  return Math.max(0, Math.min(stepCount - 1, stepIndex));
}

export function useTimesliderRange(regioId: string | undefined) {
  const { range, loading } = useTimeRange(regioId);

  const { minDate, maxDate } = useMemo(() => {
    let min = FALLBACK_MIN;
    let max = FALLBACK_MAX;
    if (range.from && range.to) {
      const fromDate = parseISO(range.from);
      const toDate = parseISO(range.to);
      if (!isNaN(fromDate.getTime())) min = fromDate;
      if (!isNaN(toDate.getTime())) max = toDate;
    }
    if (min > max) [min, max] = [max, min];
    return { minDate: min, maxDate: max };
  }, [range.from, range.to]);

  const maxStep = SLIDER_PARTS;
  const totalMs = Math.max(1, differenceInMilliseconds(maxDate, minDate));

  const stepIndexToDate = useCallback(
    (stepIndex: number): Date => {
      const ratio = stepIndex / maxStep;
      return new Date(minDate.getTime() + ratio * totalMs);
    },
    [minDate, totalMs, maxStep]
  );

  const dateToStepIndex = useCallback(
    (date: Date): number => {
      const distance = date.getTime() - minDate.getTime();
      const ratio = distance / totalMs;
      return clampToStepIndex(Math.round(ratio * maxStep), maxStep + 1);
    },
    [minDate, totalMs, maxStep]
  );

  const [values, setValues] = useState<[number, number]>(() => [0, maxStep]);
  const [orderHint, setOrderHint] = useState<string | null>(null);

  useEffect(() => {
    setValues([0, maxStep]);
  }, [maxStep, range.from, range.to]);

  useEffect(() => {
    if (!orderHint) return;
    const id = window.setTimeout(() => setOrderHint(null), 4500);
    return () => window.clearTimeout(id);
  }, [orderHint]);

  const safeValues: [number, number] = useMemo(() => {
    const from = Math.max(0, Math.min(values[0], maxStep));
    const to = Math.max(0, Math.min(values[1], maxStep));
    return from <= to ? [from, to] : [to, to];
  }, [values, maxStep]);

  const dateFrom = useMemo(
    () => stepIndexToDate(safeValues[0]),
    [safeValues[0], stepIndexToDate]
  );
  const dateTo = useMemo(
    () => stepIndexToDate(safeValues[1]),
    [safeValues[1], stepIndexToDate]
  );

  const { setDateRange } = useTimesliderState();
  useEffect(() => {
    setDateRange(format(dateFrom, "yyyy-MM-dd"), format(dateTo, "yyyy-MM-dd"));
  }, [dateFrom, dateTo, setDateRange]);

  const handleSliderChange = useCallback((newValues: number[]) => {
    setOrderHint(null);
    setValues([newValues[0], newValues[1]]);
  }, []);

  const handleFromChange = useCallback(
    (date: Date | null, invalidHint: string) => {
      if (!date) return;
      if (startOfDay(date) > startOfDay(dateTo)) {
        setOrderHint(invalidHint);
      } else {
        setOrderHint(null);
      }
      const step = dateToStepIndex(date);
      const clamped = Math.max(0, Math.min(step, safeValues[1] - 1));
      setValues([clamped, safeValues[1]]);
    },
    [dateTo, dateToStepIndex, safeValues]
  );

  const handleToChange = useCallback(
    (date: Date | null, invalidHint: string) => {
      if (!date) return;
      if (startOfDay(date) < startOfDay(dateFrom)) {
        setOrderHint(invalidHint);
      } else {
        setOrderHint(null);
      }
      const step = dateToStepIndex(date);
      const clamped = Math.min(maxStep, Math.max(step, safeValues[0] + 1));
      setValues([safeValues[0], clamped]);
    },
    [dateFrom, dateToStepIndex, maxStep, safeValues]
  );

  return {
    loading,
    maxStep,
    safeValues,
    dateFrom,
    dateTo,
    orderHint,
    handleSliderChange,
    handleFromChange,
    handleToChange,
  };
}
