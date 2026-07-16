import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { extractGrantError } from "./grantError";
import type { GrantFailureKind, Step2FailureKind } from "./grantHelpers";

export type MapLoginErrorDebugContext = {
  otpWasSent: boolean;
  loginStep?: "password" | "otp";
  hasOtp?: boolean | null;
};

export function logMapLoginErrorClassifierDebug(input: {
  error: unknown;
  context: MapLoginErrorDebugContext;
  kind: GrantFailureKind;
  finalDecision?: Step2FailureKind;
}): void {
  if (!input.context.otpWasSent || !input.finalDecision) return;

  const realError = extractGrantError(input.error);
  logAuth2ClassifierDebug("auth2.login.map_login_error", {
    hasOtp: input.context.hasOtp ?? null,
    otpWasSent: input.context.otpWasSent,
    loginStep: input.context.loginStep ?? "otp",
    realGrantErrorCode: realError.error ?? null,
    realGrantErrorDescription: realError.error_description ?? null,
    explicitGrantFailureKind: input.kind,
    finalDecision: input.finalDecision,
    responseStatus: input.finalDecision,
  });
}
