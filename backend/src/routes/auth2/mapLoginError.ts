import {
  classifyGrantFailure,
  type Step2FailureKind,
} from "./grantHelpers";
import { logAuth2ClassifierDebug } from "./auth2ClassifierDebug";
import { extractGrantError } from "./grantError";
import { passwordOrOtpIncorrectResponse } from "./authErrorResponses";

type LoginErrorBody = {
  success: false;
  message: string;
  code?: string;
  status?: string;
  error?: string;
};

export type MapLoginErrorContext = {
  otpWasSent?: boolean;
  loginStep?: "password" | "otp";
  hasOtp?: boolean | null;
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

function logMapLoginErrorClassifierDebug(
  error: unknown,
  options: MapLoginErrorContext,
  kind: string,
  finalDecision: string
): void {
  const realError = extractGrantError(error);
  const otpWasSent =
    options.otpWasSent ?? options.loginStep === "otp";

  if (!otpWasSent) {
    return;
  }

  logAuth2ClassifierDebug("auth2.login.map_login_error", {
    hasOtp: options.hasOtp ?? null,
    otpWasSent,
    loginStep: options.loginStep ?? "otp",
    realGrantErrorCode: realError.error ?? null,
    realGrantErrorDescription: realError.error_description ?? null,
    explicitGrantFailureKind: kind,
    finalDecision,
    responseStatus: finalDecision,
  });
}

export function mapLoginError(
  error: unknown,
  options: MapLoginErrorContext = {}
): {
  status: number;
  body: LoginErrorBody;
} {
  const otpWasSent =
    options.otpWasSent ?? options.loginStep === "otp";
  const kind = classifyGrantFailure(error, { otpWasSent });

  if (kind === "otp_required") {
    return {
      status: 401,
      body: {
        success: false,
        status: "otp_required",
        message: "Authenticator-code is required",
        code: "OTP_REQUIRED",
      },
    };
  }

  if (kind === "invalid_otp") {
    const body = buildStep2LoginFailureBody("otp_incorrect");
    logMapLoginErrorClassifierDebug(error, options, kind, "otp_incorrect");
    return { status: 401, body };
  }

  if (
    otpWasSent &&
    (kind === "ambiguous_invalid_grant" || kind === "unknown")
  ) {
    const body = buildStep2LoginFailureBody("password_or_otp_incorrect");
    logMapLoginErrorClassifierDebug(
      error,
      options,
      kind,
      "password_or_otp_incorrect"
    );
    return { status: 401, body };
  }

  if (
    kind === "invalid_credentials" ||
    kind === "ambiguous_invalid_grant" ||
    kind === "unknown"
  ) {
    const body = buildStep2LoginFailureBody("password_incorrect");
    logMapLoginErrorClassifierDebug(error, options, kind, "password_incorrect");
    return { status: 401, body };
  }

  const err = error as { message?: string };

  return {
    status: 500,
    body: {
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV !== "production" ? err?.message : undefined,
    },
  };
}
