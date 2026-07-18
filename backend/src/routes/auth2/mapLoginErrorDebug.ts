import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { extractGrantError } from "./grantError";
import type { GrantFailureKind, Step2FailureKind } from "./grantHelpers";

export type MapLoginErrorDebugContext = {
  otpWasSent: boolean;
  loginStep?: "password" | "otp";
  hasOtp?: boolean | null;
};

function shouldLogMapLoginErrorDebug(
  context: MapLoginErrorDebugContext,
  finalDecision?: Step2FailureKind
): boolean {
  return Boolean(context.otpWasSent && finalDecision);
}

function coalesceNull<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

function coalesceOtpStep(
  loginStep: MapLoginErrorDebugContext["loginStep"]
): "password" | "otp" {
  return loginStep ?? "otp";
}

function buildMapLoginErrorDebugPayload(input: {
  error: unknown;
  context: MapLoginErrorDebugContext;
  kind: GrantFailureKind;
  finalDecision: Step2FailureKind;
}) {
  const realError = extractGrantError(input.error);
  return {
    hasOtp: coalesceNull(input.context.hasOtp),
    otpWasSent: input.context.otpWasSent,
    loginStep: coalesceOtpStep(input.context.loginStep),
    realGrantErrorCode: coalesceNull(realError.error),
    realGrantErrorDescription: coalesceNull(realError.error_description),
    explicitGrantFailureKind: input.kind,
    finalDecision: input.finalDecision,
    responseStatus: input.finalDecision,
  };
}

export function logMapLoginErrorClassifierDebug(input: {
  error: unknown;
  context: MapLoginErrorDebugContext;
  kind: GrantFailureKind;
  finalDecision?: Step2FailureKind;
}): void {
  if (!shouldLogMapLoginErrorDebug(input.context, input.finalDecision)) {
    return;
  }

  logAuth2ClassifierDebug(
    "auth2.login.map_login_error",
    buildMapLoginErrorDebugPayload({
      error: input.error,
      context: input.context,
      kind: input.kind,
      finalDecision: input.finalDecision!,
    })
  );
}
