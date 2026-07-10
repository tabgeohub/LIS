const MAX_USERNAME_LENGTH = 256;
const MAX_PASSWORD_LENGTH = 512;
const MAX_OTP_LENGTH = 8;

export type ParsedLoginInput = {
  username: string;
  password: string;
  otp?: string;
};

export function parseLoginInput(body: unknown): ParsedLoginInput | null {
  const record = body as {
    username?: unknown;
    password?: unknown;
    otp?: unknown;
  };

  const username = String(record?.username ?? "").trim();
  const password = String(record?.password ?? "");
  const otpRaw = String(record?.otp ?? "").trim();
  const otp = otpRaw || undefined;

  if (!username || !password) {
    return null;
  }

  if (
    username.length > MAX_USERNAME_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH ||
    (otp && otp.length > MAX_OTP_LENGTH)
  ) {
    return null;
  }

  if (otp && !/^\d+$/.test(otp)) {
    return null;
  }

  return { username, password, otp };
}

export function parseVerifyInput(body: unknown): Omit<ParsedLoginInput, "otp"> | null {
  const parsed = parseLoginInput({ ...(body as object), otp: undefined });
  if (!parsed) return null;
  return { username: parsed.username, password: parsed.password };
}
