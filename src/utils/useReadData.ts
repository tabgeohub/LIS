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

// Global cache for all useReadData instances
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface InFlightRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, InFlightRequest<any>>();

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export function useReadData<T>(path: string): UseReadDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (bypassCache = false) => {
    if (!path || path === "") {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cacheKey = path;
    const now = Date.now();

    // Check cache first (unless bypassing)
    if (!bypassCache) {
      const cached = cache.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        // Use cached data
        setData(cached.data);
        setLoading(false);
        setError(null);
        return;
      }

      // Check if there's an in-flight request for the same path
      const inFlight = inFlightRequests.get(cacheKey);
      if (inFlight) {
        // Reuse the existing request
        try {
          const responseData = await inFlight.promise;
          setData(responseData);
          setLoading(false);
          setError(null);
        } catch (err: any) {
          const message =
            err.response?.data?.error || err.message || "Unknown error";
          setError(message);
          setLoading(false);
        }
        return;
      }
    }

    // Make new request
    setLoading(true);
    setError(null);

    const requestPromise = axios.get<T>(`${getBackEndUrl()}/api${path}`);

    // Store the in-flight request for deduplication
    inFlightRequests.set(cacheKey, {
      promise: requestPromise.then((res) => res.data),
      timestamp: now,
    });

    try {
      const response = await requestPromise;
      const responseData = response.data;

      // Update cache
      cache.set(cacheKey, {
        data: responseData,
        timestamp: now,
      });

      // Remove from in-flight requests
      inFlightRequests.delete(cacheKey);

      setData(responseData);
    } catch (err: any) {
      // Remove from in-flight requests on error
      inFlightRequests.delete(cacheKey);

      const message =
        err.response?.data?.error || err.message || "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, [path]);

  const refetch = () => fetchData(true);

  return { data, loading, error, refetch };
}
