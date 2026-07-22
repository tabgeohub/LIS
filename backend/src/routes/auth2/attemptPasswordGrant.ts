export function getOtpParamName(): string {
  return process.env.KC_OTP_PARAM_NAME || "otp";
}

type PasswordGrantParams = {
  username: string;
  password: string;
  otp?: string;
};

export async function attemptPasswordGrant(
  client: import("openid-client").Client,
  params: PasswordGrantParams
) {
  const { username, password, otp } = params;
  const otpParam = getOtpParamName();

  return client.grant({
    grant_type: "password",
    username,
    password,
    scope: "openid profile email",
    ...(otp ? { [otpParam]: otp } : {}),
  });
}
