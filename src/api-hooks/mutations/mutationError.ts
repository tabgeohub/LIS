import { AxiosError } from "axios";

export type MutationErrorData = {
  message?: string;
  error?: string;
};

export function getMutationErrorMessage(
  errorValue: unknown,
  fallback = "Unknown error"
): string {
  const error = errorValue as AxiosError<MutationErrorData>;
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
}

export function getMutationErrorState(
  error: AxiosError<MutationErrorData> | null
): string | null {
  return error ? getMutationErrorMessage(error) : null;
}
