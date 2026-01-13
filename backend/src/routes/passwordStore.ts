import fs from "fs";
import path from "path";
import crypto from "crypto";

const pwDir = path.join(__dirname, "..", "uploads", ".pw");

if (!fs.existsSync(pwDir)) {
  fs.mkdirSync(pwDir, { recursive: true });
}

type PwRecord = {
  salt: string; // base64
  hash: string; // base64 (scrypt)
};

function recordPath(filename: string) {
  // Store alongside uploads, file-per-zip
  return path.join(pwDir, `${filename}.json`);
}

export function setPassword(filename: string, password: string) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 32);
  const data: PwRecord = {
    salt: salt.toString("base64"),
    hash: hash.toString("base64"),
  };
  fs.writeFileSync(recordPath(filename), JSON.stringify(data), { mode: 0o600 });
}

export function hasPassword(filename: string): boolean {
  return fs.existsSync(recordPath(filename));
}

export function verifyPassword(filename: string, password: string): boolean {
  const p = recordPath(filename);
  if (!fs.existsSync(p)) return false;
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw) as PwRecord;
  const salt = Buffer.from(data.salt, "base64");
  const expected = Buffer.from(data.hash, "base64");
  const actual = crypto.scryptSync(password, salt, 32);

  // timing-safe compare
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export function clearPassword(filename: string) {
  const p = recordPath(filename);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
