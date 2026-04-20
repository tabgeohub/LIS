import crypto from "crypto";

const SCRYPT_KEY_LEN = 64;
const SCRYPT_PREFIX = "scrypt";

function scryptAsync(
  password: string,
  salt: string,
  keyLen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keyLen, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, SCRYPT_KEY_LEN);
  return `${SCRYPT_PREFIX}$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedValue: string
): Promise<boolean> {
  if (!storedValue) return false;

  if (!storedValue.startsWith(`${SCRYPT_PREFIX}$`)) {
    // Legacy compatibility while existing plaintext passwords are migrated.
    return password === storedValue;
  }

  const parts = storedValue.split("$");
  if (parts.length !== 3) return false;

  const salt = parts[1];
  const expected = Buffer.from(parts[2], "hex");
  const actual = await scryptAsync(password, salt, expected.length);

  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

export function isHashedPassword(value: string): boolean {
  return typeof value === "string" && value.startsWith(`${SCRYPT_PREFIX}$`);
}
