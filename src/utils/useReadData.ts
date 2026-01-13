/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

type UseReadDataResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useReadData<T>(path: string): UseReadDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(`${getBackEndUrl()}/api${path}`);
      setData(response.data);
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!path || path === "") {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    fetchData();
  }, [path]);

  return { data, loading, error, refetch: fetchData };
}
