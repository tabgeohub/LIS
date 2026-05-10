import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateCache } from "./useReadData";

type UseUpdateDataResult<T> = {
  update: (
    data: T,
    onCallbackSuccess?: (responseData: any) => void,
    onError?: () => void
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useUpdateData<T>(path: string): UseUpdateDataResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function update(
    data: any,
    onCallbackSuccess?: (responseData: any) => void,
    onError?: () => void
  ) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.patch(
        `${getBackEndUrl()}/api${path}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { message } = response.data;
      setSuccess(true);
      toast.success(message || "Flightplan updated successfully");

      // Invalidate related caches to ensure real-time updates
      invalidateRelatedCaches(path);

      if (onCallbackSuccess) onCallbackSuccess(response.data);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      toast.error(message);
      setError(message);
      onError?.();
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, success };
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
