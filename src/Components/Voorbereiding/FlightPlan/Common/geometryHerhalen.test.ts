import { describe, expect, it } from "vitest";
import {
  formatHerhalenLabel,
  isHerhalenTruthy,
  sortGeometriesForSelection,
  toggleGeometrySelection,
} from "./geometryHerhalen";
import type { Geometry } from "Types/geometry";

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

  it("puts selected geometries first in reverse selection order", () => {
    const geometries = [1, 2, 3, 4].map(
      (id) => ({ id, omschrijving: String(id), type: "line", points: [] }) as Geometry
    );
    expect(
      sortGeometriesForSelection(geometries, [2, 4]).map(({ id }) => id)
    ).toEqual([4, 2, 1, 3]);
  });
});
