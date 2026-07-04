import { toast } from "react-hot-toast";
import {
  apiPatch,
  apiUrl,
  useApiMutation,
} from "./apiMutation/useApiMutation";

type UpdateVariables<T> = {
  data: T;
  disableErrorMessage?: boolean;
};

export type UpdateInput<T> = {
  data: T;
  onSuccess?: (responseData: any) => void;
  onError?: () => void;
  disableErrorMessage?: boolean;
};

type UseUpdateDataResult<T> = {
  update: (input: UpdateInput<T>) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useUpdateData<T>(path: string): UseUpdateDataResult<T> {
  const mutation = useApiMutation<UpdateVariables<T>, { message?: string }>({
    path,
    method: "patch",
    defaultSuccessMessage: "Flightplan updated successfully",
    buildUrl: (apiPath) => apiUrl(apiPath),
    request: (url, variables) => apiPatch(url, variables.data),
    getSuccessMessage: (result) => result.message,
  });

  async function update(input: UpdateInput<T>) {
    mutation.reset();
    try {
      const responseData = await mutation.mutateAsync({
        data: input.data,
        disableErrorMessage: input.disableErrorMessage,
      });
      input.onSuccess?.(responseData);
    } catch (err) {
      if (!input.disableErrorMessage) {
        toast.error(mutation.getMutationErrorMessage(err));
      }
      input.onError?.();
    }
  }

  return {
    update,
    loading: mutation.loading,
    error: mutation.error,
    success: mutation.success,
  };
}
