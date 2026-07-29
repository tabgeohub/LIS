import { describe, expect, it } from "vitest";
import {
  filterPointsForStepContent,
  matchesHerhalenValue,
} from "./stepContentFilters";

describe("step content filters", () => {
  it("preserves complete point objects while excluding plan points", () => {
    const points = [
      { id: 1, herhalen: 1, omschrijving: "A", custom: "keep" },
      { id: 2, herhalen: 1, omschrijving: "B", custom: "selected" },
      { id: 3, herhalen: 0, omschrijving: "C", custom: "other" },
    ];

    expect(
      filterPointsForStepContent({
        dbPoints: points,
        herhalen: true,
        selectedPlanPointIds: [2],
      })
    ).toEqual([{ id: 1, herhalen: 1, omschrijving: "A", custom: "keep" }]);
  });

  it("matches numeric, string and boolean geometry values", () => {
    expect(
      matchesHerhalenValue({ geometryHerhalen: 1, herhalen: true })
    ).toBe(true);
    expect(
      matchesHerhalenValue({ geometryHerhalen: "0", herhalen: false })
    ).toBe(true);
    expect(
      matchesHerhalenValue({ geometryHerhalen: false, herhalen: false })
    ).toBe(true);
  });
});
