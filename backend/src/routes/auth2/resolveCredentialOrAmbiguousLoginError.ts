import type { GrantFailureKind } from "./classifyGrantFailure";
import type { Step2FailureKind } from "./classifyStep2OtpLoginFailure";
import {
  buildStep2LoginFailureBody,
  type LoginErrorBody,
} from "./buildStep2LoginFailureBody";
import type { LoginErrorDecision } from "./loginErrorDecisionTypes";

export function unauthorizedLoginDecision(
  classifierDecision: Step2FailureKind
): LoginErrorDecision {
  return {
    result: {
      status: 401,
      body: buildStep2LoginFailureBody(classifierDecision),
    },
    classifierDecision,
  };
}

function isAmbiguousGrantFailure(kind: GrantFailureKind): boolean {
  return kind === "ambiguous_invalid_grant" || kind === "unknown";
}

function isCredentialOrAmbiguous(
  kind: GrantFailureKind,
  ambiguous: boolean
): boolean {
  return kind === "invalid_credentials" || ambiguous;
}

function serverLoginFailure(input: {
  errorMessage?: string;
  exposeErrorMessage: boolean;
}): LoginErrorDecision {
  return {
    result: {
      status: 500,
      body: {
        success: false,
        message: "Login failed",
        error: input.exposeErrorMessage ? input.errorMessage : undefined,
      } satisfies LoginErrorBody,
    },
  };
}

export function resolveCredentialOrAmbiguousLoginError(input: {
  kind: GrantFailureKind;
  otpWasSent: boolean;
  errorMessage?: string;
  exposeErrorMessage: boolean;
}): LoginErrorDecision {
  const ambiguous = isAmbiguousGrantFailure(input.kind);

  if (input.otpWasSent && ambiguous) {
    return unauthorizedLoginDecision("password_or_otp_incorrect");
  }

  if (isCredentialOrAmbiguous(input.kind, ambiguous)) {
    return unauthorizedLoginDecision("password_incorrect");
  }

  return serverLoginFailure(input);
}
