import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

type UseUpdateDataResult<T> = {
  update: (
    data: T,
    onCallbackSuccess?: (responseData: any) => void
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
    onCallbackSuccess?: (responseData: any) => void
  ) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.patch(
        `${getBackEndUrl()}/api${path}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { message } = response.data;
      setSuccess(true);
      toast.success(message || "Flightplan updated successfully");

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
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, success };
}
