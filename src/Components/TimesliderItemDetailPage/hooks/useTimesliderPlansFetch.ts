import { useEffect, useState } from "react";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import {
  fetchTimesliderPlans,
  isFetchCanceled,
} from "../query/fetchTimesliderPlans";

function resetPlansIdle(input: {
  setPlans: (p: FinishedFlightPlanType[]) => void;
  setError: (e: string | null) => void;
  setLoading: (v: boolean) => void;
}) {
  input.setPlans([]);
  input.setError(null);
  input.setLoading(false);
}

export function useTimesliderPlansFetch(input: {
  enabled: boolean;
  regioId: string | undefined;
  from: string;
  to: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<FinishedFlightPlanType[]>([]);

  useEffect(() => {
    if (!input.enabled || !input.regioId) {
      resetPlansIdle({ setPlans, setError, setLoading });
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchTimesliderPlans({
      regioId: input.regioId,
      from: input.from,
      to: input.to,
      signal: controller.signal,
    })
      .then(setPlans)
      .catch((e) => {
        if (isFetchCanceled(e)) return;
        setPlans([]);
        setError("Plannen laden mislukt.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [input.enabled, input.regioId, input.from, input.to]);

  return { plans, loading, error };
}
