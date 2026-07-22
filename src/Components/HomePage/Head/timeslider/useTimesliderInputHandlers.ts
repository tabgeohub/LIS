import { useCallback } from "react";
import { startOfDay } from "date-fns";
import { clampFromStep, clampToStep } from "./timesliderRangeHelpers";

export function useTimesliderInputHandlers(input: {
  dateFrom: Date;
  dateTo: Date;
  safeValues: [number, number];
  maxStep: number;
  dateToStepIndex: (date: Date) => number;
  setValues: (values: [number, number]) => void;
  setOrderHint: (hint: string | null) => void;
}) {
  const handleSliderChange = useCallback(
    (values: number[]) => {
      input.setOrderHint(null);
      input.setValues([values[0], values[1]]);
    },
    [input.setOrderHint, input.setValues]
  );

  const handleFromChange = useCallback(
    (date: Date | null, invalidHint: string) => {
      if (!date) return;
      input.setOrderHint(
        startOfDay(date) > startOfDay(input.dateTo) ? invalidHint : null
      );
      input.setValues([
        clampFromStep(
          input.dateToStepIndex(date),
          input.safeValues[1]
        ),
        input.safeValues[1],
      ]);
    },
    [input]
  );

  const handleToChange = useCallback(
    (date: Date | null, invalidHint: string) => {
      if (!date) return;
      input.setOrderHint(
        startOfDay(date) < startOfDay(input.dateFrom) ? invalidHint : null
      );
      input.setValues([
        input.safeValues[0],
        clampToStep({
          step: input.dateToStepIndex(date),
          fromStep: input.safeValues[0],
          maxStep: input.maxStep,
        }),
      ]);
    },
    [input]
  );

  return { handleSliderChange, handleFromChange, handleToChange };
}
