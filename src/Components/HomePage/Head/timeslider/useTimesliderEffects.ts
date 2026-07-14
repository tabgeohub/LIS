import { useEffect } from "react";
import { format } from "date-fns";

export function useResetTimesliderRange(input: {
  maxStep: number;
  from?: string | null;
  to?: string | null;
  setValues: (values: [number, number]) => void;
}) {
  useEffect(() => {
    input.setValues([0, input.maxStep]);
  }, [input.maxStep, input.from, input.to, input.setValues]);
}

export function useClearTimesliderOrderHint(input: {
  orderHint: string | null;
  setOrderHint: (hint: string | null) => void;
}) {
  useEffect(() => {
    if (!input.orderHint) return;
    const id = window.setTimeout(() => input.setOrderHint(null), 4500);
    return () => window.clearTimeout(id);
  }, [input.orderHint, input.setOrderHint]);
}

export function usePublishTimesliderRange(input: {
  dateFrom: Date;
  dateTo: Date;
  setDateRange: (from: string, to: string) => void;
}) {
  useEffect(() => {
    input.setDateRange(
      format(input.dateFrom, "yyyy-MM-dd"),
      format(input.dateTo, "yyyy-MM-dd")
    );
  }, [input.dateFrom, input.dateTo, input.setDateRange]);
}
