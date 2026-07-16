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
    expect(matchesHerhalenValue(1, true)).toBe(true);
    expect(matchesHerhalenValue("0", false)).toBe(true);
    expect(matchesHerhalenValue(false, false)).toBe(true);
  });
});
