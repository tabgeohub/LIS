import { extractGrantError } from "./grantError";
import {
  hasExplicitOtpRejectedSignal,
  hasExplicitOtpRequiredSignal,
  normalizeGrantError,
} from "./grantFailureSignals";

export type GrantFailureKind =
  | "invalid_credentials"
  | "invalid_otp"
  | "otp_required"
  | "ambiguous_invalid_grant"
  | "unknown";

const INVALID_CREDENTIAL_FRAGMENTS = [
  "invalid credentials",
  "invalid user credentials",
  "invaliduser credentials",
] as const;

function hasInvalidCredentialsSignal(normalized: string): boolean {
  return INVALID_CREDENTIAL_FRAGMENTS.some((fragment) =>
    normalized.includes(fragment)
  );
}

function isAmbiguousGrantError(errorCode: string | undefined): boolean {
  return errorCode === "invalid_grant" || errorCode === "unauthorized_client";
}

export function classifyGrantFailure(
  error: unknown,
  options: { otpWasSent: boolean }
): GrantFailureKind {
  const details = extractGrantError(error);
  const normalized = normalizeGrantError(details);

  if (hasExplicitOtpRequiredSignal(normalized)) {
    return "otp_required";
  }

  if (options.otpWasSent && hasExplicitOtpRejectedSignal(normalized)) {
    return "invalid_otp";
  }

  if (isAmbiguousGrantError(details.error) || hasInvalidCredentialsSignal(normalized)) {
    return "ambiguous_invalid_grant";
  }

  return "unknown";
}
