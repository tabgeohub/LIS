import { passwordOrOtpIncorrectResponse } from "./authErrorResponses";
import type { Step2FailureKind } from "./classifyStep2OtpLoginFailure";

export type LoginErrorBody = {
  success: false;
  message: string;
  code?: string;
  status?: string;
  error?: string;
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
