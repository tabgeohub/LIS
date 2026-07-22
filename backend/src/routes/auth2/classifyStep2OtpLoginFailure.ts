import { extractGrantError } from "./grantError";
import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { logAuthSecurityEvent } from "./authSecurityLog";
import {
  describeGrantErrorForClassifierDebug,
  hasExplicitPasswordRejectedSignal,
  normalizeGrantError,
} from "./grantFailureSignals";
import {
  classifyGrantFailure,
  type GrantFailureKind,
} from "./classifyGrantFailure";

export type Step2FailureKind =
  | "otp_incorrect"
  | "password_incorrect"
  | "password_or_otp_incorrect";

export type ClassifyStep2DebugContext = {
  hasOtp: boolean | null;
  otpWasSent: boolean;
  loginStep: "otp" | "password";
};

function decideStep2FailureKind(
  explicitKind: GrantFailureKind,
  normalized: string
): Step2FailureKind {
  if (explicitKind === "invalid_otp") return "otp_incorrect";
  if (hasExplicitPasswordRejectedSignal(normalized)) return "password_incorrect";
  return "password_or_otp_incorrect";
}

function coalesceDebugField<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
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
  const result = decideStep2FailureKind(explicitKind, normalized);

  logAuth2ClassifierDebug("auth2.login.step2_classify", {
    hasOtp: coalesceDebugField(debugContext?.hasOtp, null),
    otpWasSent: coalesceDebugField(debugContext?.otpWasSent, true),
    loginStep: coalesceDebugField(debugContext?.loginStep, "otp"),
    realGrantErrorCode: realGrant.errorCode,
    realGrantErrorDescription: realGrant.errorDescription,
    explicitGrantFailureKind: explicitKind,
    finalDecision: result,
    responseStatus: result,
  });

  logAuthSecurityEvent({
    event: "auth2.login.step2_classify",
    meta: {
      explicitKind,
      result,
    },
  });

  return result;
}
