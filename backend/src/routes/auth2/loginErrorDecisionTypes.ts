import type { Step2FailureKind } from "./classifyStep2OtpLoginFailure";
import type { LoginErrorBody } from "./buildStep2LoginFailureBody";

export type LoginErrorResult = {
  status: number;
  body: LoginErrorBody;
};

export type LoginErrorDecision = {
  result: LoginErrorResult;
  classifierDecision?: Step2FailureKind;
};
