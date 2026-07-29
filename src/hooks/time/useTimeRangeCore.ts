import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

export interface TimeRangeResult {
  from: string | null;
  to: string | null;
}

export function useTimeRange(regioId: string | undefined) {
  const [range, setRange] = useState<TimeRangeResult>({ from: null, to: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveFetchError = (err: unknown): string =>
    err instanceof Error ? err.message : String(err);

  const applyTimeRange = (data: TimeRangeResult) => {
    setRange({
      from: data.from ?? null,
      to: data.to ?? null,
    });
  };

  const fetchTimeRange = useCallback(async () => {
    if (!regioId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${getBackEndUrl()}/api/timeslider/getTimeRange`;
      const res = await axios.get<TimeRangeResult>(url, {
        params: { regio_id: regioId },
      });
      applyTimeRange(res.data);
    } catch (err) {
      console.error("Failed to fetch time range:", err);
      setError(resolveFetchError(err));
    } finally {
      setLoading(false);
    }
  }, [regioId]);

  useEffect(() => {
    fetchTimeRange();
  }, [fetchTimeRange]);

  return { range, loading, error, refetch: fetchTimeRange };
}
