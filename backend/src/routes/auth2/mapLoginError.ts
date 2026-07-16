import {
  classifyGrantFailure,
} from "./grantHelpers";
import {
  buildStep2LoginFailureBody,
  resolveLoginErrorDecision,
  type LoginErrorResult,
} from "./loginErrorDecision";
import { logMapLoginErrorClassifierDebug } from "./mapLoginErrorDebug";

export { buildStep2LoginFailureBody } from "./loginErrorDecision";

export type MapLoginErrorContext = {
  otpWasSent?: boolean;
  loginStep?: "password" | "otp";
  hasOtp?: boolean | null;
};

export function mapLoginError(
  error: unknown,
  options: MapLoginErrorContext = {}
): LoginErrorResult {
  const otpWasSent = options.otpWasSent ?? options.loginStep === "otp";
  const kind = classifyGrantFailure(error, { otpWasSent });
  const decision = resolveLoginErrorDecision({
    kind,
    otpWasSent,
    errorMessage: (error as { message?: string })?.message,
    exposeErrorMessage: process.env.NODE_ENV !== "production",
  });

  logMapLoginErrorClassifierDebug({
    error,
    context: { otpWasSent, loginStep: options.loginStep, hasOtp: options.hasOtp },
    kind,
    finalDecision: decision.classifierDecision,
  });

  return decision.result;
}
