import { describe, expect, it } from "vitest";
import {
  clampFromStep,
  clampToStep,
  createTimesliderConversions,
  normalizeSliderValues,
  parseTimesliderRange,
} from "./timesliderRangeHelpers";

describe("timeslider range helpers", () => {
  it("normalizes reversed date ranges", () => {
    const reversed = parseTimesliderRange("2025-01-10", "2025-01-01");
    expect([
      reversed.minDate.getFullYear(),
      reversed.minDate.getMonth() + 1,
      reversed.minDate.getDate(),
    ]).toEqual([2025, 1, 1]);
    expect([
      reversed.maxDate.getFullYear(),
      reversed.maxDate.getMonth() + 1,
      reversed.maxDate.getDate(),
    ]).toEqual([2025, 1, 10]);
  });

  it("converts dates and slider steps", () => {
    const conversions = createTimesliderConversions(
      new Date("2025-01-01T00:00:00Z"),
      new Date("2025-01-11T00:00:00Z"),
      10
    );
    expect(conversions.stepIndexToDate(5).toISOString()).toBe(
      "2025-01-06T00:00:00.000Z"
    );
    expect(
      conversions.dateToStepIndex(new Date("2025-01-06T00:00:00Z"))
    ).toBe(5);
    expect(normalizeSliderValues([8, 2], 10)).toEqual([2, 2]);
    expect(clampFromStep(10, 5)).toBe(4);
    expect(clampToStep(0, 5, 10)).toBe(6);
  });
});
