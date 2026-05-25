import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateAfterMutation } from "lib/invalidateAfterMutation";

type CreateVariables<T> = {
  data: T;
  disableErrorMessage?: boolean;
  disableSuccessMessage?: boolean;
};

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ data }: CreateVariables<T>) => {
      const response = await axios.post<R>(
        `${getBackEndUrl()}/api${path}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: async (responseData, variables) => {
      if (!variables.disableSuccessMessage) {
        toast.success(responseData.message || "Created successfully");
      }
      await invalidateAfterMutation(queryClient, path);
    },
  });

  async function create(
    data: T,
    onCallbackSuccess?: (responseData: R) => void,
    disableErrorMessage = false,
    disableSuccessMessage = false
  ): Promise<number | null> {
    mutation.reset();
    try {
      const responseData = await mutation.mutateAsync({
        data,
        disableErrorMessage,
        disableSuccessMessage,
      });

      if (onCallbackSuccess) onCallbackSuccess(responseData);

      return responseData.id ?? null;
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      if (!disableErrorMessage) toast.error(message);

      return null;
    }
  }

  const lastError = mutation.error as AxiosError<{
    message?: string;
    error?: string;
  }> | null;

  return {
    create,
    loading: mutation.isPending,
    error:
      lastError?.response?.data?.message ||
      lastError?.response?.data?.error ||
      lastError?.message ||
      null,
    success: mutation.isSuccess,
  };
}
