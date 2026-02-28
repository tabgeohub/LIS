import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateCache } from "./useReadData";

type UseCreateDataResult<T, R> = {
  create: (
    data: T,
    onCallbackSuccess?: (responseData: R) => void,
    disableErrorMessage?: boolean,
    disableSuccessMessage?: boolean
  ) => Promise<number | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useCreateData<T, R extends { message?: string; id?: number }>(
  path: string
): UseCreateDataResult<T, R> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function create(
    data: T,
    onCallbackSuccess?: (responseData: R) => void,
    disableErrorMessage = false,
    disableSuccessMessage = false
  ): Promise<number | null> {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<R>(
        `${getBackEndUrl()}/api${path}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { message, id } = response.data;

      setSuccess(true);
      if (!disableSuccessMessage)
        toast.success(message || "Created successfully");

      // Invalidate related caches to ensure real-time updates
      invalidateRelatedCaches(path);

      if (onCallbackSuccess) onCallbackSuccess(response.data);

      return id ?? null;
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      setError(message);
      if (!disableErrorMessage) toast.error(message);

      return null;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error, success };
}

/**
 * Invalidate caches related to the API path being modified
 * This ensures real-time updates across all components
 */
function invalidateRelatedCaches(path: string): void {
  // Invalidate flight plan related caches
  if (path.includes("/flightPlans")) {
    invalidateCache("/flightPlans");
  }
  
  // Invalidate points related caches
  if (path.includes("/points")) {
    invalidateCache("/points");
  }
  
  // Invalidate geometries related caches
  if (path.includes("/geometries")) {
    invalidateCache("/geometries");
  }
  
  // Invalidate template plans related caches
  if (path.includes("/templateFlight") || path.includes("/template_plans")) {
    invalidateCache("/templateFlight");
    invalidateCache("/template_plans");
  }
  
  // Invalidate finished plans related caches
  if (path.includes("/finished_plans")) {
    invalidateCache("/finished_plans");
  }
  
  // Invalidate emails related caches
  if (path.includes("/emails")) {
    invalidateCache("/emails");
  }
}
