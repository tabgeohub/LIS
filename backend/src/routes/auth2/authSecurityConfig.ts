/**
 * When enabled, step-1 failures return a single generic message
 * ("Username or password is incorrect") to reduce username enumeration.
 *
 * OTP step-2 errors remain specific (INVALID_OTP, etc.).
 */
const TRUTHY_FLAGS = new Set(["true", "1", "yes"]);
const FALSY_FLAGS = new Set(["false", "0", "no"]);

function parseExplicitBooleanFlag(
  value: string | undefined
): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (TRUTHY_FLAGS.has(normalized)) return true;
  if (FALSY_FLAGS.has(normalized)) return false;
  return undefined;
}

export function isGenericAuthErrorsEnabled(): boolean {
  const explicit = parseExplicitBooleanFlag(process.env.AUTH2_GENERIC_ERRORS);
  if (explicit !== undefined) return explicit;
  return process.env.NODE_ENV === "production";
}
