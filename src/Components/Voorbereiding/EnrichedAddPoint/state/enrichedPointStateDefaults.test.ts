import { describe, expect, it } from "vitest";
import { initialEnrichedPointValues } from "./enrichedPointStateDefaults";

describe("initialEnrichedPointValues", () => {
  it("keeps the documented reset defaults", () => {
    expect(initialEnrichedPointValues).toEqual({
      step: 1,
      xCoord: 0,
      yCoord: 0,
      longitude: 0,
      latitude: 0,
      coordinateSystem: "RD",
      vertrouwelijk: false,
      herhalen: false,
      omschrijving: "",
      activiteit: "",
      organisatie: "",
      specifiekLettenOp: "",
      currentPoint: { x: 0, y: 0 },
      mapClickedNotify: 0,
    });
  });
});
