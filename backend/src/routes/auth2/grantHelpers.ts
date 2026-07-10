import { extractGrantError, type GrantErrorDetails } from "./grantError";
import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { logAuthSecurityEvent } from "./authSecurityLog";

export function getOtpParamName(): string {
  return process.env.KC_OTP_PARAM_NAME || "otp";
}

type PasswordGrantParams = {
  username: string;
  password: string;
  otp?: string;
};

export async function attemptPasswordGrant(
  client: import("openid-client").Client,
  params: PasswordGrantParams
) {
  const { username, password, otp } = params;
  const otpParam = getOtpParamName();

  return client.grant({
    grant_type: "password",
    username,
    password,
    scope: "openid profile email",
    ...(otp ? { [otpParam]: otp } : {}),
  });
}

export type GrantFailureKind =
  | "invalid_credentials"
  | "invalid_otp"
  | "otp_required"
  | "ambiguous_invalid_grant"
  | "unknown";

export type Step2FailureKind =
  | "otp_incorrect"
  | "password_incorrect"
  | "password_or_otp_incorrect";

export type ClassifyStep2DebugContext = {
  hasOtp: boolean | null;
  otpWasSent: boolean;
  loginStep: "otp" | "password";
};

function normalizeGrantError(details: GrantErrorDetails): string {
  return [details.error, details.error_description, details.message]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

function hasExplicitOtpRequiredSignal(normalized: string): boolean {
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

function hasExplicitOtpRejectedSignal(normalized: string): boolean {
  return (
    normalized.includes("invalid totp") ||
    normalized.includes("invalid otp") ||
    normalized.includes("wrong totp") ||
    normalized.includes("wrong otp") ||
    normalized.includes("totp validation")
  );
}

function hasExplicitPasswordRejectedSignal(normalized: string): boolean {
  return (
    normalized.includes("invalid password") ||
    normalized.includes("wrong password") ||
    normalized.includes("incorrect password")
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

  if (options.otpWasSent && hasExplicitOtpRejectedSignal(normalized)) {
    return "invalid_otp";
  }

  if (
    details.error === "invalid_grant" ||
    details.error === "unauthorized_client"
  ) {
    return "ambiguous_invalid_grant";
  }

  if (
    normalized.includes("invalid credentials") ||
    normalized.includes("invalid user credentials") ||
    normalized.includes("invaliduser credentials")
  ) {
    return "ambiguous_invalid_grant";
  }

  return "unknown";
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

/**
 * Step 2 only: classify OTP login failure from the real grant error.
 *
 * Keycloak often returns the same ambiguous invalid_grant for wrong password
 * and wrong OTP — we cannot distinguish those cases and return
 * password_or_otp_incorrect instead of guessing.
 *
 * Step 1 never validates password for OTP users.
 */
export function classifyStep2OtpLoginFailure(
  originalError: unknown,
  debugContext?: ClassifyStep2DebugContext
): Step2FailureKind {
  const explicitKind = classifyGrantFailure(originalError, { otpWasSent: true });
  const realGrant = describeGrantErrorForClassifierDebug(originalError);
  const normalized = normalizeGrantError(extractGrantError(originalError));

  let result: Step2FailureKind;

  if (explicitKind === "invalid_otp") {
    result = "otp_incorrect";
  } else if (hasExplicitPasswordRejectedSignal(normalized)) {
    result = "password_incorrect";
  } else if (
    explicitKind === "ambiguous_invalid_grant" ||
    explicitKind === "unknown"
  ) {
    result = "password_or_otp_incorrect";
  } else {
    result = "password_or_otp_incorrect";
  }

  logAuth2ClassifierDebug("auth2.login.step2_classify", {
    hasOtp: debugContext?.hasOtp ?? null,
    otpWasSent: debugContext?.otpWasSent ?? true,
    loginStep: debugContext?.loginStep ?? "otp",
    realGrantErrorCode: realGrant.errorCode,
    realGrantErrorDescription: realGrant.errorDescription,
    explicitGrantFailureKind: explicitKind,
    finalDecision: result,
    responseStatus: result,
  });

  logAuthSecurityEvent("auth2.login.step2_classify", {
    explicitKind,
    result,
  });

  return result;
}
