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

function to01(value: unknown): number | null {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  const s = String(value).trim().toLowerCase();
  if (TRUTHY_FLAGS.has(s)) {
    return 1;
  }
  if (FALSY_FLAGS.has(s)) {
    return 0;
  }
  return null;
}

function toStr(value: unknown): string | null {
  const s = (value ?? "").toString().trim();
  return s.length ? s : null;
}

function normalizeImportRow(row: unknown): NormalizedImportRow | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const record = row as Record<string, unknown>;
  const omschrijving = String(record.omschrijving ?? "").trim();
  const user_id = String(record.user_id ?? "").trim();

  if (!omschrijving || !user_id) {
    return null;
  }

  return {
    omschrijving,
    regio_id: toStr(record.regio_id),
    xcoordinaat_rd: toNum(record.xcoordinaat_rd),
    ycoordinaat_rd: toNum(record.ycoordinaat_rd),
    latitude: toNum(record.latitude),
    longitude: toNum(record.longitude),
    vertrouwelijk: to01(record.vertrouwelijk),
    herhalen: to01(record.herhalen),
    user_id,
    activiteit_id: toStr(record.activiteit_id),
    organisatie_id: toStr(record.organisatie_id),
    specifiek_letten_op: toStr(record.specifiek_letten_op),
  };
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
