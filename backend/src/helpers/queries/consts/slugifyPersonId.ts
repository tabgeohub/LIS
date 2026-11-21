import { pool } from "../../../db";

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function slugToken(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Build a person id base from naam, e.g. "Holm, Albrecht" → "albrecht.holm". */
export function slugifyPersonIdBase(naam: string): string {
  const withoutParen = naam.trim().replace(/\s*\([^)]*\)\s*$/u, "").trim();
  if (!withoutParen) return "item";

  let tokens: string[];
  if (withoutParen.includes(",")) {
    const [last, ...rest] = withoutParen.split(",").map((part) => part.trim());
    const first = rest.join(" ").trim();
    tokens = [first, last].filter(Boolean);
  } else {
    tokens = withoutParen.split(/\s+/u).filter(Boolean);
  }

  const slug = tokens
    .map(slugToken)
    .filter(Boolean)
    .join(".")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return slug || "item";
}

export async function allocateUniquePersonId(input: {
  table: "lis.piloten" | "lis.waarnemers";
  naam: string;
}): Promise<string> {
  const base = slugifyPersonIdBase(input.naam);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await pool.query(
      `SELECT 1 FROM ${input.table} WHERE id = $1 LIMIT 1`,
      [candidate]
    );
    if (existing.rows.length === 0) {
      return candidate;
    }
    candidate = `${base}${suffix}`;
    suffix += 1;
  }
}
