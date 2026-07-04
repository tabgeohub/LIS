import { AxiosError } from "axios";

export type MutationErrorData = {
  message?: string;
  error?: string;
};

export function getMutationErrorMessage(
  err: unknown,
  fallback = "Unknown error"
): string {
  const error = err as AxiosError<MutationErrorData>;
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
  if (!error) return null;
  return getMutationErrorMessage(error);
}
