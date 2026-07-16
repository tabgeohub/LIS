import { describe, expect, it } from "vitest";
import {
  buildPopupDisplayAttributes,
  formatPopupFieldName,
  formatPopupValue,
  resolvePopupPosition,
} from "./featureLayerPopupFormatting";

describe("feature layer popup formatting", () => {
  it("formats names and values", () => {
    expect(formatPopupFieldName("inspectie_datum")).toBe("Inspectie Datum");
    expect(formatPopupValue(true)).toBe("Ja");
  });

  it("positions and filters popup attributes", () => {
    expect(resolvePopupPosition({ x: 10, y: 80 })).toEqual({ x: 30, y: 30 });
    expect(
      buildPopupDisplayAttributes({
        OBJECTID: 1,
        created_user: "x",
        naam: "Brug",
      })
    ).toEqual([{ label: "Naam", value: "Brug" }]);
  });
});
