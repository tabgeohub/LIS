import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import { invalidateAfterMutation } from "lib/invalidateAfterMutation";
import {
  getMutationErrorMessage,
  getMutationErrorState,
  MutationErrorData,
} from "./mutationError";

export type ApiMutationMethod = "post" | "patch" | "delete";

export type ApiMutationConfig<TVariables, TResult> = {
  path: string;
  method: ApiMutationMethod;
  defaultSuccessMessage: string;
  buildUrl: (path: string, variables: TVariables) => string;
  request: (url: string, variables: TVariables) => Promise<TResult>;
  getSuccessMessage?: (result: TResult) => string | undefined;
  shouldToastSuccess?: (variables: TVariables) => boolean;
  shouldToastError?: (variables: TVariables) => boolean;
  onMutationSuccess?: (
    result: TResult,
    variables: TVariables
  ) => void | Promise<void>;
};

function shouldToastSuccessMessage<TVariables>(
  config: ApiMutationConfig<TVariables, unknown>,
  variables: TVariables
): boolean {
  return config.shouldToastSuccess?.(variables) ?? true;
}

function resolveSuccessMessage<TVariables, TResult>(
  config: ApiMutationConfig<TVariables, TResult>,
  result: TResult
): string {
  return config.getSuccessMessage?.(result) ?? config.defaultSuccessMessage;
}

export function useApiMutation<TVariables, TResult>(
  config: ApiMutationConfig<TVariables, TResult>
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: TVariables) => {
      const url = config.buildUrl(config.path, variables);
      return config.request(url, variables);
    },
    onSuccess: async (result, variables) => {
      if (shouldToastSuccessMessage(config, variables)) {
        toast.success(resolveSuccessMessage(config, result));
      }

      await invalidateAfterMutation(queryClient, config.path);
      await config.onMutationSuccess?.(result, variables);
    },
  });

  const lastError = mutation.error as AxiosError<MutationErrorData> | null;
  return {
    mutateAsync: mutation.mutateAsync,
    reset: mutation.reset,
    loading: mutation.isPending,
    error: getMutationErrorState(lastError),
    success: mutation.isSuccess,
    getMutationErrorMessage,
  };
}

export function apiPost<TResult>(url: string, data: unknown) {
  return axios
    .post<TResult>(url, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.data);
}

export function apiPatch<TResult>(url: string, data: unknown) {
  return axios
    .patch<TResult>(url, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.data);
}

export function apiDelete<TResult>(url: string, data?: unknown) {
  return axios
    .delete<TResult>(url, { data, withCredentials: true })
    .then((response) => response.data);
}

export function apiUrl(path: string) {
  return `${getBackEndUrl()}/api${path}`;
}
