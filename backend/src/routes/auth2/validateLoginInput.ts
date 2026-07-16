const MAX_USERNAME_LENGTH = 256;
const MAX_PASSWORD_LENGTH = 512;
const MAX_OTP_LENGTH = 8;

export type ParsedLoginInput = {
  username: string;
  password: string;
  otp?: string;
};

function exceedsCredentialLimits(input: ParsedLoginInput): boolean {
  return (
    input.username.length > MAX_USERNAME_LENGTH ||
    input.password.length > MAX_PASSWORD_LENGTH ||
    Boolean(input.otp && input.otp.length > MAX_OTP_LENGTH)
  );
}

function isValidOtp(otp: string | undefined): boolean {
  return !otp || /^\d+$/.test(otp);
}

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

  const parsed = { username, password, otp };
  if (!username || !password) return null;
  if (exceedsCredentialLimits(parsed) || !isValidOtp(otp)) return null;
  return parsed;
}

export function parseVerifyInput(body: unknown): Omit<ParsedLoginInput, "otp"> | null {
  const parsed = parseLoginInput({ ...(body as object), otp: undefined });
  if (!parsed) return null;
  return { username: parsed.username, password: parsed.password };
}
