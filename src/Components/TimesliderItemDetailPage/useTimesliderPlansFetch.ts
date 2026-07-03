import { useEffect, useState } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import { sortPlansNewestFirst } from "@helpers/timeslider";

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
      setPlans([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<FinishedFlightPlanType[]>(
        `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
        {
          params: {
            regio_id: input.regioId,
            from: input.from,
            to: input.to,
          },
          signal: controller.signal,
        }
      )
      .then((res) => setPlans(sortPlansNewestFirst(res.data || [])))
      .catch((e) => {
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        setPlans([]);
        setError("Plannen laden mislukt.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [input.enabled, input.regioId, input.from, input.to]);

  return { plans, loading, error };
}
