import { toast } from "react-hot-toast";
import {
  apiPost,
  apiUrl,
  useApiMutation,
} from "./apiMutation/useApiMutation";

type CreateVariables<T> = {
  data: T;
  disableErrorMessage?: boolean;
  disableSuccessMessage?: boolean;
};

type CreateInput<T, R> = {
  data: T;
  onSuccess?: (responseData: R) => void;
  disableErrorMessage?: boolean;
  disableSuccessMessage?: boolean;
};

type UseCreateDataResult<T, R> = {
  create: (input: CreateInput<T, R>) => Promise<number | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useCreateData<T, R extends { message?: string; id?: number }>(
  path: string
): UseCreateDataResult<T, R> {
  const mutation = useApiMutation<CreateVariables<T>, R>({
    path,
    method: "post",
    defaultSuccessMessage: "Created successfully",
    buildUrl: (apiPath) => apiUrl(apiPath),
    request: (url, variables) => apiPost<R>(url, variables.data),
    getSuccessMessage: (result) => result.message,
    shouldToastSuccess: (variables) => !variables.disableSuccessMessage,
  });

  async function create(input: CreateInput<T, R>): Promise<number | null> {
    mutation.reset();
    try {
      const responseData = await mutation.mutateAsync({
        data: input.data,
        disableErrorMessage: input.disableErrorMessage,
        disableSuccessMessage: input.disableSuccessMessage,
      });

      input.onSuccess?.(responseData);
      return responseData.id ?? null;
    } catch (err) {
      if (!input.disableErrorMessage) {
        toast.error(mutation.getMutationErrorMessage(err));
      }
      return null;
    }
  }

  return {
    create,
    loading: mutation.loading,
    error: mutation.error,
    success: mutation.success,
  };
}
