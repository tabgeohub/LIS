import * as XLSX from "@e965/xlsx";
import { PointImportRow } from "@helpers/points/pointColumnKeys";

type NumericColumn =
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude";

const NUMERIC_COLUMNS = new Set<NumericColumn>([
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
]);

type TruthyColumn = "herhalen" | "vertrouwelijk";

const TRUTHY_COLUMNS = new Set<TruthyColumn>(["herhalen", "vertrouwelijk"]);

function isNumericColumn(key: string): key is NumericColumn {
  return NUMERIC_COLUMNS.has(key as NumericColumn);
}

function isTruthyColumn(key: string): key is TruthyColumn {
  return TRUTHY_COLUMNS.has(key as TruthyColumn);
}

function parseNumericCell(value: unknown): number {
  const raw = String(value ?? "")
    .trim()
    .replace(",", ".")
    .replace(/\s/g, "");
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function createEmptyPointRow(userId: string): PointImportRow {
  return {
    omschrijving: "",
    regio_id: "",
    xcoordinaat_rd: 0,
    ycoordinaat_rd: 0,
    latitude: 0,
    longitude: 0,
    herhalen: 0,
    vertrouwelijk: 0,
    user_id: userId,
    activiteit_id: "",
    organisatie_id: "",
    specifiek_letten_op: "",
  };
}

export function isCsvFileName(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return (
    lower.endsWith(".csv.xls") ||
    lower.endsWith(".csv") ||
    lower.endsWith(".csv.xlsx")
  );
}

export function parseCsvRows(text: string): string[][] {
  const delimiter = ";";
  const lines = text.split(/\r?\n/);
  const expectedFieldCount = lines[0]?.split(delimiter).length ?? 0;
  const rows: string[][] = [];
  let buffer = "";

  for (const line of lines) {
    if (!line?.trim()) continue;

    buffer += (buffer ? "\n" : "") + line;
    const fields = buffer.split(delimiter);

    if (fields.length === expectedFieldCount) {
      rows.push(fields.map((f) => f.trim()));
      buffer = "";
    }
  }

  return rows;
}

export function parseExcelRows(buffer: ArrayBuffer): string[][] {
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
}

export function mapImportRowsToPoints(input: {
  rows: string[][];
  userId: string;
  resolveOrgValue: (label: string) => string;
}): PointImportRow[] {
  const { rows, userId, resolveOrgValue } = input;
  if (rows.length < 2) return [];

  const headers = rows[0];

  return rows
    .slice(1)
    .map((row) => {
      const obj = createEmptyPointRow(userId);

      headers.forEach((key, index) => {
        const value = row[index];
        applyImportColumn({ obj, key, value, resolveOrgValue });
      });

      return obj;
    })
    .filter((p) => p.omschrijving !== "");
}

function applyImportColumn(input: {
  obj: PointImportRow;
  key: string;
  value: unknown;
  resolveOrgValue: (label: string) => string;
}) {
  const { obj, key, value, resolveOrgValue } = input;
  if (key === "omschrijving") {
    obj.omschrijving = String(value || "").trim();
    return;
  }

  if (key === "regio_id") {
    obj.regio_id = String(value || "").trim();
    return;
  }

  if (isNumericColumn(key)) {
    obj[key] = parseNumericCell(value);
    return;
  }

  if (isTruthyColumn(key)) {
    obj[key] =
      value == null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? value ?? 0
        : String(value);
    return;
  }

  if (key === "activiteit_id") {
    obj.activiteit_id = String(value ?? "")
      .replace(/[\n\r"]/g, "")
      .trim()
      .toLowerCase();
    return;
  }

  if (key === "organisatie_id") {
    obj.organisatie_id = String(resolveOrgValue(String(value ?? ""))).trim();
    return;
  }

  if (key === "specifiek_letten_op") {
    obj.specifiek_letten_op = String(value || "").trim();
  }
}

export function splitImportedPointIds(points: Array<PointImportRow & { id: number | null }>) {
  const herhalen = points.filter((p) => p.herhalen === "ja").map((p) => p.id) as number[];
  const nietHerhalen = points.filter((p) => p.herhalen === "nee").map((p) => p.id) as number[];
  return { herhalen, nietHerhalen };
}
