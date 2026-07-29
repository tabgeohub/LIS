import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { filterPlansByPeriod } from "./filterPlansByPeriod";

const plans = [
  { datum: "2026-06-18", vluchtnummer: "OLD-001" },
  { datum: "2026-06-19", vluchtnummer: "RWS-002" },
  { datum: "2026-07-16", vluchtnummer: "RWS-003" },
];

describe("flight plan period filtering", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-17T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns every plan for both all-period spellings", () => {
    expect(filterPlansByPeriod({ plans, periodFilter: "Alle", filterText: "RWS" })).toBe(plans);
    expect(filterPlansByPeriod({ plans, periodFilter: "alle" })).toBe(plans);
  });

  it("includes the four-week boundary and applies text filtering", () => {
    expect(
      filterPlansByPeriod({
        plans,
        periodFilter: "Laatste 4 weken",
        filterText: "rws",
      }).map(({ vluchtnummer }) => vluchtnummer)
    ).toEqual(["RWS-002", "RWS-003"]);
  });

  it("keeps date-range boundaries inclusive", () => {
    expect(
      filterPlansByPeriod({
        plans,
        periodFilter: "Periodoe van-tot",
        dateFrom: "2026-06-19",
        dateTo: "2026-07-16",
      })
    ).toEqual([plans[1], plans[2]]);
  });
});
