import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateCache } from "./useReadData";

type UseDeleteDataResult<T> = {
  deleteData: (
    id: string | number,
    data?: T,
    onSuccess?: () => void,
    refetch?: () => void
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useDeleteData<T = undefined>(
  path: string
): UseDeleteDataResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function deleteData(
    id: string | number,
    data?: T,
    onSuccess?: () => void,
    refetch?: () => void
  ): Promise<void> {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.delete<{ message?: string }>(
        `${getBackEndUrl()}/api${path}/${id}`,
        { data, withCredentials: true }
      );

      const { message } = response.data;

      setSuccess(true);
      toast.success(message || "Deleted successfully");

      // Invalidate related caches to ensure real-time updates
      invalidateRelatedCaches(path);

      if (refetch) refetch();
      if (onSuccess) onSuccess();
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;

      const message =
        error.response?.data?.error || error.message || "Unknown error";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { deleteData, loading, error, success };
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
