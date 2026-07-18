import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

export interface TimeRangeResult {
  from: string | null;
  to: string | null;
}

export function useTimeRange(regioId: string | undefined) {
  const [range, setRange] = useState<TimeRangeResult>({ from: null, to: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setRange({
        from: res.data.from ?? null,
        to: res.data.to ?? null,
      });
    } catch (err) {
      console.error("Failed to fetch time range:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [regioId]);

  useEffect(() => {
    fetchTimeRange();
  }, [fetchTimeRange]);

  return { range, loading, error, refetch: fetchTimeRange };
}
