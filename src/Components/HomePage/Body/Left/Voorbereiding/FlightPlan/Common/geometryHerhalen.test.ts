import { describe, expect, it } from "vitest";
import {
  formatHerhalenLabel,
  isHerhalenTruthy,
  toggleGeometrySelection,
} from "./geometryHerhalen";

describe("geometry herhalen helpers", () => {
  it("normalizes the values returned by existing data sources", () => {
    expect(isHerhalenTruthy(true)).toBe(true);
    expect(isHerhalenTruthy(1)).toBe(true);
    expect(isHerhalenTruthy("JA")).toBe(true);
    expect(isHerhalenTruthy(0)).toBe(false);
    expect(formatHerhalenLabel("false")).toBe("Nee");
  });

  it("adds and removes a geometry without reordering other selections", () => {
    expect(toggleGeometrySelection([1, 3], 2)).toEqual([1, 3, 2]);
    expect(toggleGeometrySelection([1, 3, 2], 3)).toEqual([1, 2]);
  });
});
