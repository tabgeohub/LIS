import { extractGrantError } from "./grantError";
import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { logAuthSecurityEvent } from "./authSecurityLog";
import {
  describeGrantErrorForClassifierDebug,
  hasExplicitOtpRejectedSignal,
  hasExplicitOtpRequiredSignal,
  hasExplicitPasswordRejectedSignal,
  normalizeGrantError,
} from "./grantFailureSignals";

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

  const result: Step2FailureKind =
    explicitKind === "invalid_otp"
      ? "otp_incorrect"
      : hasExplicitPasswordRejectedSignal(normalized)
        ? "password_incorrect"
        : "password_or_otp_incorrect";

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
