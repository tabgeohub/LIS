import type { GrantFailureKind } from "./classifyGrantFailure";
import {
  buildStep2LoginFailureBody,
  type LoginErrorBody,
} from "./buildStep2LoginFailureBody";
import type { LoginErrorDecision } from "./loginErrorDecisionTypes";
import {
  resolveCredentialOrAmbiguousLoginError,
  unauthorizedLoginDecision,
} from "./resolveCredentialOrAmbiguousLoginError";

export type { LoginErrorBody, LoginErrorDecision };
export type { LoginErrorResult } from "./loginErrorDecisionTypes";
export { buildStep2LoginFailureBody };
export { resolveCredentialOrAmbiguousLoginError };

export function resolveLoginErrorDecision(input: {
  kind: GrantFailureKind;
  otpWasSent: boolean;
  errorMessage?: string;
  exposeErrorMessage: boolean;
}): LoginErrorDecision {
  if (input.kind === "otp_required") {
    return {
      result: {
        status: 401,
        body: {
          success: false,
          status: "otp_required",
          message: "Authenticator-code is required",
          code: "OTP_REQUIRED",
        },
      },
    };
  }

  if (input.kind === "invalid_otp") {
    return unauthorizedLoginDecision("otp_incorrect");
  }

  return resolveCredentialOrAmbiguousLoginError(input);
}
