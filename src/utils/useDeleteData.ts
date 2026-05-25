import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { invalidateAfterMutation } from "lib/invalidateAfterMutation";

type DeleteVariables<T> = {
  id: string | number;
  data?: T;
  onSuccess?: () => void;
  refetch?: () => void;
};

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: DeleteVariables<T>) => {
      const response = await axios.delete<{ message?: string }>(
        `${getBackEndUrl()}/api${path}/${id}`,
        { data, withCredentials: true }
      );
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      toast.success(_data.message || "Deleted successfully");
      await invalidateAfterMutation(queryClient, path);
      variables.refetch?.();
      variables.onSuccess?.();
    },
  });

  async function deleteData(
    id: string | number,
    data?: T,
    onSuccess?: () => void,
    refetch?: () => void
  ): Promise<void> {
    mutation.reset();
    try {
      await mutation.mutateAsync({ id, data, onSuccess, refetch });
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        error.response?.data?.error || error.message || "Unknown error";

      toast.error(message);
    }
  }

  const lastError = mutation.error as AxiosError<{
    message?: string;
    error?: string;
  }> | null;

  return {
    deleteData,
    loading: mutation.isPending,
    error: lastError?.response?.data?.error || lastError?.message || null,
    success: mutation.isSuccess,
  };
}
