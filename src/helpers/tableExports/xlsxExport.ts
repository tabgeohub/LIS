import { saveAs } from "file-saver";
import * as XLSX from "@e965/xlsx";
import JSZip from "jszip";
import type { EnrichedPointType, FlightPlanType } from "Types";

export function buildXlsxBuffer<T extends object>(
  rows: T[],
  sheetName: string
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

function xlsxBlob(rows: object[], sheetName: string) {
  return new Blob([buildXlsxBuffer(rows, sheetName)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadXlsxFromRows<T extends object>(input: {
  rows: T[];
  filename: string;
  sheetName: string;
}) {
  saveAs(xlsxBlob(input.rows, input.sheetName), input.filename);
}

function planRowsWithoutPoints(plans: FlightPlanType[]) {
  return plans.map(({ points, ...plan }) => plan);
}

export async function exportPointsPlansXlsx(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  const cleanedPlans = planRowsWithoutPoints(input.plans);

  if (input.points.length && input.plans.length) {
    const zip = new JSZip();
    zip.file("points_export.xlsx", buildXlsxBuffer(input.points, "Points"));
    zip.file(
      "plans_export.xlsx",
      buildXlsxBuffer(cleanedPlans, "FlightPlans")
    );
    saveAs(await zip.generateAsync({ type: "blob" }), "exports_xlsx.zip");
  } else if (input.points.length) {
    saveAs(xlsxBlob(input.points, "Points"), "points_export.xlsx");
  } else if (input.plans.length) {
    saveAs(xlsxBlob(cleanedPlans, "FlightPlans"), "plans_export.xlsx");
  }
}
