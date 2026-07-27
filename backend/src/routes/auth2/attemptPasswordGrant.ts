export function getOtpParamName(): string {
  return process.env.KC_OTP_PARAM_NAME || "otp";
}

export type AttemptPasswordGrantInput = {
  client: import("openid-client").Client;
  username: string;
  password: string;
  otp?: string;
};

export async function attemptPasswordGrant(input: AttemptPasswordGrantInput) {
  const { client, username, password, otp } = input;
  const otpParam = getOtpParamName();

  return client.grant({
    grant_type: "password",
    username,
    password,
    scope: "openid profile email",
    ...(otp ? { [otpParam]: otp } : {}),
  });
}
