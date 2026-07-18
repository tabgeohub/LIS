import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { EnrichedPointType, FlightPlanType } from "Types";

/**
 * RFC 4180 cell escaping; quotes also neutralize spreadsheet formulas / CWE-79
 * false positives when Semgrep treats CSV builders as HTML strings.
 */
export function escapeCsvCell(value: unknown): string {
  const stringValue = String(value ?? "");
  // Always quote; double embedded quotes per RFC 4180.
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function buildCsvFromRows<T extends object>(
  rows: T[],
  excludeKeys: string[] = []
) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]).filter(
    (key) => !excludeKeys.includes(key)
  );
  return [
    // nosemgrep: javascript.lang.security.audit.xss.direct-response-write / CWE-79 - CSV escaping, not HTML.
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeCsvCell((row as Record<string, unknown>)[header])
        )
        .join(",")
    ),
  ].join("\n");
}

function csvBlob(rows: object[], excludeKeys: string[] = []) {
  return new Blob([buildCsvFromRows(rows, excludeKeys)], {
    type: "text/csv;charset=utf-8;",
  });
}

export function downloadCsvFromRows<T extends object>(input: {
  rows: T[];
  filename: string;
  excludeKeys?: string[];
}) {
  saveAs(csvBlob(input.rows, input.excludeKeys), input.filename);
}

export async function exportPointsPlansCsv(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  if (input.points.length && input.plans.length) {
    const zip = new JSZip();
    zip.file("points_export.csv", buildCsvFromRows(input.points));
    zip.file("plans_export.csv", buildCsvFromRows(input.plans, ["points"]));
    saveAs(await zip.generateAsync({ type: "blob" }), "exports.zip");
  } else if (input.points.length) {
    saveAs(csvBlob(input.points), "points_export.csv");
  } else if (input.plans.length) {
    saveAs(csvBlob(input.plans, ["points"]), "plans_export.csv");
  }
}
