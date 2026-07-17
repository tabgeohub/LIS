import { extractGrantError, type GrantErrorDetails } from "./grantError";

export function normalizeGrantError(details: GrantErrorDetails): string {
  return [details.error, details.error_description, details.message]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

export function hasExplicitOtpRequiredSignal(normalized: string): boolean {
  const patterns = [
    "otp missing",
    "missing otp",
    "otp required",
    "totp required",
    "missing totp",
    "authenticator code required",
    "authenticator-code is required",
    "authenticator code is missing",
    "authenticator-code is missing",
    "multi-factor",
    "two-factor",
  ];

  return patterns.some((pattern) => normalized.includes(pattern));
}

export function hasExplicitOtpRejectedSignal(normalized: string): boolean {
  return (
    normalized.includes("invalid totp") ||
    normalized.includes("invalid otp") ||
    normalized.includes("wrong totp") ||
    normalized.includes("wrong otp") ||
    normalized.includes("totp validation")
  );
}

export function hasExplicitPasswordRejectedSignal(normalized: string): boolean {
  return (
    normalized.includes("invalid password") ||
    normalized.includes("wrong password") ||
    normalized.includes("incorrect password")
  );
}

export function describeGrantErrorForClassifierDebug(error: unknown): {
  errorCode: string | null;
  errorDescription: string | null;
} {
  const details = extractGrantError(error);

  return {
    errorCode: details.error ?? null,
    errorDescription: details.error_description ?? null,
  };
}
