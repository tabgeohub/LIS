export type ReturnMode = "all" | "existing" | "created";

export type NormalizedImportRow = {
  omschrijving: string;
  regio_id: string | null;
  xcoordinaat_rd: number | null;
  ycoordinaat_rd: number | null;
  latitude: number | null;
  longitude: number | null;
  vertrouwelijk: number | null;
  herhalen: number | null;
  user_id: string;
  activiteit_id: string | null;
  organisatie_id: string | null;
  specifiek_letten_op: string | null;
};

export function parseReturnMode(returnMode: unknown): ReturnMode {
  return returnMode === "existing" || returnMode === "created"
    ? returnMode
    : "all";
}

const TRUTHY_FLAGS = new Set(["1", "ja", "true", "yes"]);
const FALSY_FLAGS = new Set(["0", "nee", "false", "no"]);

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

function toNum(value: unknown): number | null {
  if (isEmpty(value)) {
    return null;
  }
  const n =
    typeof value === "string"
      ? parseFloat(value.replace(",", "."))
      : Number(value);
  return Number.isFinite(n) ? n : null;
}

function flagFromString(s: string): number | null {
  if (TRUTHY_FLAGS.has(s)) {
    return 1;
  }
  if (FALSY_FLAGS.has(s)) {
    return 0;
  }
  return null;
}

function to01(value: unknown): number | null {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return flagFromString(String(value).trim().toLowerCase());
}

function toStr(value: unknown): string | null {
  const s = (value ?? "").toString().trim();
  return s.length ? s : null;
}

function requiredTrimmed(
  record: Record<string, unknown>,
  key: string
): string {
  return String(record[key] ?? "").trim();
}

function buildNormalizedFields(input: {
  record: Record<string, unknown>;
  omschrijving: string;
  user_id: string;
}): NormalizedImportRow {
  return {
    omschrijving: input.omschrijving,
    regio_id: toStr(input.record.regio_id),
    xcoordinaat_rd: toNum(input.record.xcoordinaat_rd),
    ycoordinaat_rd: toNum(input.record.ycoordinaat_rd),
    latitude: toNum(input.record.latitude),
    longitude: toNum(input.record.longitude),
    vertrouwelijk: to01(input.record.vertrouwelijk),
    herhalen: to01(input.record.herhalen),
    user_id: input.user_id,
    activiteit_id: toStr(input.record.activiteit_id),
    organisatie_id: toStr(input.record.organisatie_id),
    specifiek_letten_op: toStr(input.record.specifiek_letten_op),
  };
}

function normalizeImportRow(row: unknown): NormalizedImportRow | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const record = row as Record<string, unknown>;
  const omschrijving = requiredTrimmed(record, "omschrijving");
  const user_id = requiredTrimmed(record, "user_id");

  if (!omschrijving || !user_id) {
    return null;
  }

  return buildNormalizedFields({ record, omschrijving, user_id });
}

export function normalizeImportRows(
  rows: unknown[]
): NormalizedImportRow[] {
  const normalized: NormalizedImportRow[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const parsed = normalizeImportRow(row);
    if (!parsed) {
      continue;
    }

    const key = parsed.omschrijving.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(parsed);
  }

  return normalized;
}
