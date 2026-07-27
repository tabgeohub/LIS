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

function isInvalidOtpFailure(input: {
  otpWasSent: boolean;
  normalized: string;
}): boolean {
  return input.otpWasSent && hasExplicitOtpRejectedSignal(input.normalized);
}

function isAmbiguousFailure(input: {
  errorCode: string | undefined;
  normalized: string;
}): boolean {
  return (
    isAmbiguousGrantError(input.errorCode) ||
    hasInvalidCredentialsSignal(input.normalized)
  );
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

  if (isInvalidOtpFailure({ otpWasSent: options.otpWasSent, normalized })) {
    return "invalid_otp";
  }

  if (isAmbiguousFailure({ errorCode: details.error, normalized })) {
    return "ambiguous_invalid_grant";
  }

  return "unknown";
}
