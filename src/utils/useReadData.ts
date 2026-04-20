/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from "react";
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
// Track active refetch functions for each path to enable automatic refetch on cache invalidation
const activeRefetchCallbacks = new Map<string, Set<() => void>>();

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Invalidate cache entries that match the given pattern
 * @param pattern - String pattern to match against cache keys (supports partial matching)
 * @param exactMatch - If true, only invalidate exact matches. If false, invalidate all keys containing the pattern
 */
export function invalidateCache(pattern: string, exactMatch = false): void {
  const keysToInvalidate: string[] = [];
  
  if (exactMatch) {
    keysToInvalidate.push(pattern);
  } else {
    // Find all cache entries that contain the pattern
    cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToInvalidate.push(key);
      }
    });
  }
  
  // Invalidate cache and trigger refetch for active hooks
  keysToInvalidate.forEach((key) => {
    cache.delete(key);
    inFlightRequests.delete(key);
    
    // Trigger refetch for all active hooks using this path
    const callbacks = activeRefetchCallbacks.get(key);
    if (callbacks) {
      callbacks.forEach((refetch) => {
        try {
          refetch();
        } catch (err) {
          // Ignore errors from refetch callbacks (component might be unmounted)
          console.warn("Error during cache invalidation refetch:", err);
        }
      });
    }
    
    // Also trigger refetch for hooks with paths that contain the invalidated key
    activeRefetchCallbacks.forEach((callbacks, activeKey) => {
      if (activeKey.includes(pattern) && activeKey !== key) {
        callbacks.forEach((refetch) => {
          try {
            refetch();
          } catch (err) {
            console.warn("Error during cache invalidation refetch:", err);
          }
        });
      }
    });
  });
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  cache.clear();
  inFlightRequests.clear();
  // Trigger refetch for all active hooks
  activeRefetchCallbacks.forEach((callbacks) => {
    callbacks.forEach((refetch) => {
      try {
        refetch();
      } catch (err) {
        console.warn("Error during cache clear refetch:", err);
      }
    });
  });
}

export function useReadData<T>(path: string): UseReadDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store the latest fetchData function to avoid stale closures
  const fetchDataRef = useRef<(bypassCache?: boolean) => Promise<void>>();

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

    const requestPromise = axios.get<T>(`${getBackEndUrl()}/api${path}`, {
      withCredentials: true,
    });

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
  
  // Store the latest fetchData in ref
  fetchDataRef.current = fetchData;

  useEffect(() => {
    fetchData(false);
  }, [path]);

  // Memoize refetch to prevent infinite loops
  const refetch = useCallback(() => {
    if (fetchDataRef.current) {
      fetchDataRef.current(true);
    }
  }, []);

  // Register refetch callback for automatic cache invalidation
  useEffect(() => {
    if (!path || path === "") return;
    
    const cacheKey = path;
    if (!activeRefetchCallbacks.has(cacheKey)) {
      activeRefetchCallbacks.set(cacheKey, new Set());
    }
    
    // Create a stable refetch wrapper that always calls the latest fetchData
    const refetchWrapper = () => {
      if (fetchDataRef.current) {
        fetchDataRef.current(true);
      }
    };
    
    activeRefetchCallbacks.get(cacheKey)!.add(refetchWrapper);
    
    // Cleanup: remove refetch callback when component unmounts or path changes
    return () => {
      const callbacks = activeRefetchCallbacks.get(cacheKey);
      if (callbacks) {
        callbacks.delete(refetchWrapper);
        if (callbacks.size === 0) {
          activeRefetchCallbacks.delete(cacheKey);
        }
      }
    };
  }, [path]);

  return { data, loading, error, refetch };
}
