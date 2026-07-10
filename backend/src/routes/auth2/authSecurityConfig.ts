/**
 * When enabled, step-1 failures return a single generic message
 * ("Username or password is incorrect") to reduce username enumeration.
 *
 * OTP step-2 errors remain specific (INVALID_OTP, etc.).
 */
export function isGenericAuthErrorsEnabled(): boolean {
  const explicit = process.env.AUTH2_GENERIC_ERRORS?.trim().toLowerCase();
  if (explicit === "true" || explicit === "1" || explicit === "yes") {
    return true;
  }
  if (explicit === "false" || explicit === "0" || explicit === "no") {
    return false;
  }
  return process.env.NODE_ENV === "production";
}
