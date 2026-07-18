import { useMemo, useState } from "react";
import { normalizeSliderValues } from "./timesliderRangeHelpers";
import { useTimesliderRangeBounds } from "./useTimesliderRangeBounds";

export function useTimesliderRangeState(regioId: string | undefined) {
  const bounds = useTimesliderRangeBounds(regioId);
  const [values, setValues] = useState<[number, number]>(() => [
    0,
    bounds.maxStep,
  ]);
  const [orderHint, setOrderHint] = useState<string | null>(null);
  const safeValues = useMemo(
    () => normalizeSliderValues(values, bounds.maxStep),
    [values, bounds.maxStep]
  );
  return { ...bounds, values, setValues, orderHint, setOrderHint, safeValues };
}
