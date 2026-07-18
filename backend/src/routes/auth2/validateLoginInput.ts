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

function coalesceEmpty(value: unknown): string {
  return String(value ?? "");
}

function optionalOtp(otpRaw: string): string | undefined {
  return otpRaw || undefined;
}

function extractLoginFields(body: unknown): ParsedLoginInput {
  const record = body as {
    username?: unknown;
    password?: unknown;
    otp?: unknown;
  };

  return {
    username: coalesceEmpty(record?.username).trim(),
    password: coalesceEmpty(record?.password),
    otp: optionalOtp(coalesceEmpty(record?.otp).trim()),
  };
}

function isParsedLoginValid(parsed: ParsedLoginInput): boolean {
  if (!parsed.username || !parsed.password) return false;
  if (exceedsCredentialLimits(parsed)) return false;
  return isValidOtp(parsed.otp);
}

export function parseLoginInput(body: unknown): ParsedLoginInput | null {
  const parsed = extractLoginFields(body);
  if (!isParsedLoginValid(parsed)) return null;
  return parsed;
}

export function parseVerifyInput(body: unknown): Omit<ParsedLoginInput, "otp"> | null {
  const parsed = parseLoginInput({ ...(body as object), otp: undefined });
  if (!parsed) return null;
  return { username: parsed.username, password: parsed.password };
}
