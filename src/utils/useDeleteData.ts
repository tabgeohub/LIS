import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

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
        { data }
      );

      const { message } = response.data;

      setSuccess(true);
      toast.success(message || "Deleted successfully");

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
