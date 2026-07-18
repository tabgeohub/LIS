import { toast } from "react-hot-toast";
import { apiDelete, apiUrl, useApiMutation } from "./useApiMutation";

type DeleteVariables<T> = {
  id: string | number;
  data?: T;
  onSuccess?: () => void;
  refetch?: () => void;
};

type DeleteInput<T> = DeleteVariables<T>;

type UseDeleteDataResult<T> = {
  deleteData: (input: DeleteInput<T>) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useDeleteData<T = undefined>(
  path: string
): UseDeleteDataResult<T> {
  const mutation = useApiMutation<DeleteVariables<T>, { message?: string }>({
    path,
    method: "delete",
    defaultSuccessMessage: "Deleted successfully",
    buildUrl: (apiPath, variables) => `${apiUrl(apiPath)}/${variables.id}`,
    request: (url, variables) => apiDelete(url, variables.data),
    getSuccessMessage: (result) => result.message,
    onMutationSuccess: async (_result, variables) => {
      variables.refetch?.();
      variables.onSuccess?.();
    },
  });

  async function deleteData(input: DeleteInput<T>): Promise<void> {
    mutation.reset();
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      toast.error(mutation.getMutationErrorMessage(error));
    }
  }

  return {
    deleteData,
    loading: mutation.loading,
    error: mutation.error,
    success: mutation.success,
  };
}
