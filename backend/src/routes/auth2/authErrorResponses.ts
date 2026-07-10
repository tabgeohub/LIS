import { isGenericAuthErrorsEnabled } from "./authSecurityConfig";

export function invalidCredentialsResponse() {
  return {
    success: false as const,
    status: "invalid_credentials" as const,
    code: "INVALID_CREDENTIALS" as const,
    message: "Username or password is incorrect",
  };
}

export function invalidUsernameResponse() {
  if (isGenericAuthErrorsEnabled()) {
    return invalidCredentialsResponse();
  }

  return {
    success: false as const,
    status: "invalid_username" as const,
    code: "INVALID_USERNAME" as const,
    message: "Username is incorrect",
  };
}

export function invalidPasswordResponse() {
  if (isGenericAuthErrorsEnabled()) {
    return invalidCredentialsResponse();
  }

  return {
    success: false as const,
    status: "password_incorrect" as const,
    code: "INVALID_PASSWORD" as const,
    message: "Password is incorrect",
  };
}

export function passwordOrOtpIncorrectResponse() {
  return {
    success: false as const,
    status: "password_or_otp_incorrect" as const,
    code: "INVALID_PASSWORD_OR_OTP" as const,
    message: "Password or authenticator code is incorrect",
  };
}
