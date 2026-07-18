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

function buildMapLoginErrorDebugPayload(input: {
  error: unknown;
  context: MapLoginErrorDebugContext;
  kind: GrantFailureKind;
  finalDecision: Step2FailureKind;
}) {
  const realError = extractGrantError(input.error);
  return {
    hasOtp: input.context.hasOtp ?? null,
    otpWasSent: input.context.otpWasSent,
    loginStep: input.context.loginStep ?? "otp",
    realGrantErrorCode: realError.error ?? null,
    realGrantErrorDescription: realError.error_description ?? null,
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
