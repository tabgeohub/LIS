import * as XLSX from "@e965/xlsx";
import { describe, expect, it } from "vitest";
import type { FlightPlanType } from "Types";
import { POINT_EXPORT_COLUMNS } from "./pointColumnKeys";
import {
  buildFlightPlanPointExportRows,
  normalizeExportNumber,
  normalizeJaNee,
} from "./flightPlanPointExcel";
import { buildXlsxBuffer } from "@helpers/tableExports/xlsxExport";

describe("flight plan point Excel export", () => {
  it("normalizes spreadsheet values using the existing rules", () => {
    expect(normalizeJaNee(" YES ")).toBe("ja");
    expect(normalizeJaNee(0)).toBe("nee");
    expect(normalizeExportNumber(" 12,50 ")).toBe(12.5);
    expect(normalizeExportNumber("invalid")).toBe("");
  });

  it("prepares rows and preserves the configured column order", () => {
    const plan = {
      activiteit_id: "plan-activity",
      organisatie_id: "plan-organisation",
      points: [
        {
          longitude: "4,5",
          latitude: 52,
          xcoordinaat_rd: "100",
          ycoordinaat_rd: 200,
          omschrijving: "Point",
          regio_id: "RWS NN",
          herhalen: true,
          vertrouwelijk: 0,
          user_id: "user-1",
          specifiek_letten_op: "note",
          created_at: "2026-07-16",
        },
      ],
    } as unknown as FlightPlanType;

    const rows = buildFlightPlanPointExportRows(plan);
    expect(rows[0]).toMatchObject({
      geometry: "X: 4,5, Y: 52",
      longitude: 4.5,
      herhalen: "ja",
      vertrouwelijk: "nee",
      activiteit_id: "plan-activity",
      organisatie_id: "plan-organisation",
    });

    const buffer = buildXlsxBuffer({
      rows,
      sheetName: "Points",
      header: [...POINT_EXPORT_COLUMNS],
    });
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetRows = XLSX.utils.sheet_to_json<string[]>(
      workbook.Sheets.Points,
      { header: 1 }
    );
    expect(sheetRows[0]).toEqual([...POINT_EXPORT_COLUMNS]);
  });
});
