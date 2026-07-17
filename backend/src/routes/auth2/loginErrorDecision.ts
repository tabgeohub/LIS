import type { GrantFailureKind, Step2FailureKind } from "./grantHelpers";
import { passwordOrOtpIncorrectResponse } from "./authErrorResponses";

export type LoginErrorBody = {
  success: false;
  message: string;
  code?: string;
  status?: string;
  error?: string;
};

export type LoginErrorResult = {
  status: number;
  body: LoginErrorBody;
};

export type LoginErrorDecision = {
  result: LoginErrorResult;
  classifierDecision?: Step2FailureKind;
};

export function buildStep2LoginFailureBody(
  kind: Step2FailureKind
): LoginErrorBody {
  if (kind === "otp_incorrect") {
    return {
      success: false,
      status: "otp_incorrect",
      message: "Authenticator-code is incorrect",
      code: "INVALID_OTP",
    };
  }

  if (kind === "password_or_otp_incorrect") {
    return passwordOrOtpIncorrectResponse();
  }

  return {
    success: false,
    status: "password_incorrect",
    message: "Password is incorrect",
    code: "INVALID_PASSWORD",
  };
}

function unauthorizedDecision(
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

export function resolveCredentialOrAmbiguousLoginError(input: {
  kind: GrantFailureKind;
  otpWasSent: boolean;
  errorMessage?: string;
  exposeErrorMessage: boolean;
}): LoginErrorDecision {
  const isAmbiguous =
    input.kind === "ambiguous_invalid_grant" || input.kind === "unknown";

  if (input.otpWasSent && isAmbiguous) {
    return unauthorizedDecision("password_or_otp_incorrect");
  }

  if (input.kind === "invalid_credentials" || isAmbiguous) {
    return unauthorizedDecision("password_incorrect");
  }

  return {
    result: {
      status: 500,
      body: {
        success: false,
        message: "Login failed",
        error: input.exposeErrorMessage ? input.errorMessage : undefined,
      },
    },
  };
}

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
    return unauthorizedDecision("otp_incorrect");
  }

  return resolveCredentialOrAmbiguousLoginError(input);
}
