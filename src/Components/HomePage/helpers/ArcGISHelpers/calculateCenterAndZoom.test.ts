import { describe, expect, it } from "vitest";
import type { FinishedFlightPlanType, FinishedGeometryType } from "Types/finished_plans";
import {
  calculateCenterAndZoom,
  calculateZoom,
  collectPointsForCenterAndZoom,
  geometryCentroid,
} from "./calculateCenterAndZoom";

describe("center and zoom calculations", () => {
  it("uses the Netherlands default for empty or invalid coordinates", () => {
    expect(calculateCenterAndZoom([])).toEqual({
      center: { latitude: 52.1326, longitude: 5.2913 },
      zoom: 8,
    });
    expect(
      calculateCenterAndZoom([{ latitude: Number.NaN, longitude: 5 }])
    ).toEqual({ center: { latitude: 52.1326, longitude: 5.2913 }, zoom: 8 });
  });

  it("calculates a center and retains maximum zoom for one point", () => {
    expect(calculateCenterAndZoom([{ latitude: 52, longitude: 5 }])).toEqual({
      center: { latitude: 52, longitude: 5 },
      zoom: 15,
    });
  });

  it("preserves all zoom thresholds", () => {
    expect([0, 1, 2, 5, 10, 20, 40, 80, 190].map(calculateZoom)).toEqual([
      15, 14, 13, 12, 11, 10, 9, 8, 7,
    ]);
  });

  it("collects standalone points and one centroid per geometry", () => {
    const geometry = {
      points: [
        { latitude: 50, longitude: 4 },
        { latitude: 52, longitude: 6 },
      ],
    } as FinishedGeometryType;
    expect(geometryCentroid(geometry)).toEqual({ lat: 51, lon: 5 });

    const plan = {
      points_data: [{ latitude: 53, longitude: 7 }],
      geometries: [geometry],
    } as FinishedFlightPlanType;
    expect(collectPointsForCenterAndZoom(plan)).toEqual([
      { latitude: 53, longitude: 7 },
      { latitude: 51, longitude: 5 },
    ]);
  });
});
