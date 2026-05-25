import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateAfterMutation } from "lib/invalidateAfterMutation";

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: T) => {
      const response = await axios.patch(
        `${getBackEndUrl()}/api${path}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: async (responseData) => {
      const message = responseData?.message;
      toast.success(message || "Flightplan updated successfully");
      await invalidateAfterMutation(queryClient, path);
    },
  });

  async function update(
    data: T,
    onCallbackSuccess?: (responseData: any) => void,
    onError?: () => void
  ) {
    mutation.reset();
    try {
      const responseData = await mutation.mutateAsync(data);
      if (onCallbackSuccess) onCallbackSuccess(responseData);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      toast.error(message);
      onError?.();
    }
  }

  const lastError = mutation.error as AxiosError<{
    message?: string;
    error?: string;
  }> | null;

  return {
    update,
    loading: mutation.isPending,
    error:
      lastError?.response?.data?.message ||
      lastError?.response?.data?.error ||
      lastError?.message ||
      null,
    success: mutation.isSuccess,
  };
}
