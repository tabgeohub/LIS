import * as XLSX from "@e965/xlsx";
import { PointImportRow } from "@helpers/points/pointColumnKeys";
import {
  EMPTY_POINT_IDENTITY_FIELDS,
  EMPTY_POINT_NUMERIC_FLAGS,
} from "@helpers/points/emptyPointCoreFields";

type NumericColumn =
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude";

type TruthyColumn = "herhalen" | "vertrouwelijk";

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
    ...EMPTY_POINT_IDENTITY_FIELDS,
    ...EMPTY_POINT_NUMERIC_FLAGS,
    user_id: userId,
    activiteit_id: "",
    organisatie_id: "",
    specifiek_letten_op: "",
  };
}

const CSV_EXTENSIONS = [".csv.xls", ".csv", ".csv.xlsx"] as const;

export function isCsvFileName(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return CSV_EXTENSIONS.some((extension) => lower.endsWith(extension));
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

type ApplyImportColumnInput = {
  obj: PointImportRow;
  key: string;
  value: unknown;
  resolveOrgValue: (label: string) => string;
};

type ImportColumnHandler = (input: ApplyImportColumnInput) => void;

function numericColumnHandler(key: NumericColumn): ImportColumnHandler {
  return ({ obj, value }) => {
    obj[key] = parseNumericCell(value);
  };
}

function truthyColumnHandler(key: TruthyColumn): ImportColumnHandler {
  return ({ obj, value }) => {
    obj[key] =
      value == null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? value ?? 0
        : String(value);
  };
}

const IMPORT_COLUMN_HANDLERS: Record<string, ImportColumnHandler> = {
  omschrijving: ({ obj, value }) => {
    obj.omschrijving = String(value || "").trim();
  },
  regio_id: ({ obj, value }) => {
    obj.regio_id = String(value || "").trim();
  },
  xcoordinaat_rd: numericColumnHandler("xcoordinaat_rd"),
  ycoordinaat_rd: numericColumnHandler("ycoordinaat_rd"),
  latitude: numericColumnHandler("latitude"),
  longitude: numericColumnHandler("longitude"),
  herhalen: truthyColumnHandler("herhalen"),
  vertrouwelijk: truthyColumnHandler("vertrouwelijk"),
  activiteit_id: ({ obj, value }) => {
    obj.activiteit_id = String(value ?? "")
      .replace(/[\n\r"]/g, "")
      .trim()
      .toLowerCase();
  },
  organisatie_id: ({ obj, value, resolveOrgValue }) => {
    obj.organisatie_id = String(resolveOrgValue(String(value ?? ""))).trim();
  },
  specifiek_letten_op: ({ obj, value }) => {
    obj.specifiek_letten_op = String(value || "").trim();
  },
};

export function applyImportColumn(input: ApplyImportColumnInput): void {
  IMPORT_COLUMN_HANDLERS[input.key]?.(input);
}

export function splitImportedPointIds(points: Array<PointImportRow & { id: number | null }>) {
  const herhalen = points.filter((p) => p.herhalen === "ja").map((p) => p.id) as number[];
  const nietHerhalen = points.filter((p) => p.herhalen === "nee").map((p) => p.id) as number[];
  return { herhalen, nietHerhalen };
}
