import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

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
