import { describe, expect, it } from "vitest";
import {
  isCsvFileName,
  mapImportRowsToPoints,
  parseCsvRows,
} from "./parsePointImportFile";

describe("point import parsing", () => {
  it("recognizes the supported CSV filename variants", () => {
    expect(isCsvFileName("points.csv")).toBe(true);
    expect(isCsvFileName("points.csv.xlsx")).toBe(true);
    expect(isCsvFileName("points.xlsx")).toBe(false);
  });

  it("maps numeric, truthy, lookup and text columns without changing rules", () => {
    const points = mapImportRowsToPoints({
      rows: [
        [
          "omschrijving",
          "regio_id",
          "xcoordinaat_rd",
          "herhalen",
          "activiteit_id",
          "organisatie_id",
          "specifiek_letten_op",
        ],
        [" Point ", " RWS NN ", " 12,5 ", "ja", '"ACTIVITY"', "Org", " Note "],
      ],
      userId: "user-1",
      resolveOrgValue: (label) => (label === "Org" ? "org-1" : ""),
    });

    expect(points).toEqual([
      expect.objectContaining({
        omschrijving: "Point",
        regio_id: "RWS NN",
        xcoordinaat_rd: 12.5,
        herhalen: "ja",
        activiteit_id: "activity",
        organisatie_id: "org-1",
        specifiek_letten_op: "Note",
        user_id: "user-1",
      }),
    ]);
  });

  it("keeps the existing semicolon row reconstruction behavior", () => {
    expect(parseCsvRows("omschrijving;regio_id\nPoint;RWS NN")).toEqual([
      ["omschrijving", "regio_id"],
      ["Point", "RWS NN"],
    ]);
  });
});
