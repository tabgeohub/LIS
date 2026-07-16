import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildCoordinateSyncPatch } from "./buildCoordinateSyncPatch";

const transformCoordinates = vi.hoisted(() =>
  vi.fn((input: { fromProjection: string; x: number; y: number }) =>
    input.fromProjection === "RD"
      ? { x: 5.387, y: 52.156 }
      : { x: 155000, y: 463000 }
  )
);

vi.mock("@helpers/ArcGISHelpers/getTransformedCoordinates", () => ({
  getTransformedCoordinates: transformCoordinates,
}));

describe("buildCoordinateSyncPatch", () => {
  beforeEach(() => {
    transformCoordinates.mockClear();
  });

  it("converts RD coordinates into a WGS84 patch", () => {
    const patch = buildCoordinateSyncPatch({
      coordinateSystem: "RD",
      rdX: 155000,
      rdY: 463000,
      latitude: 0,
      longitude: 0,
    });

    expect(patch).toEqual({ longitude: 5.387, latitude: 52.156 });
    expect(patch?.rdX).toBeUndefined();
    expect(transformCoordinates).toHaveBeenCalledWith({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: 155000,
      y: 463000,
    });
  });

  it("converts WGS84 coordinates into an RD patch", () => {
    const patch = buildCoordinateSyncPatch({
      coordinateSystem: "WGS84",
      rdX: 0,
      rdY: 0,
      longitude: 5.387,
      latitude: 52.156,
    });

    expect(patch).toEqual({ rdX: 155000, rdY: 463000 });
    expect(patch?.longitude).toBeUndefined();
    expect(transformCoordinates).toHaveBeenCalledWith({
      fromProjection: "WGS84",
      toProjection: "RD",
      x: 5.387,
      y: 52.156,
    });
  });

  it("does not create a patch for an unsupported system", () => {
    expect(
      buildCoordinateSyncPatch({
        coordinateSystem: "unknown",
        rdX: 0,
        rdY: 0,
        latitude: 0,
        longitude: 0,
      })
    ).toBeNull();
  });
});
