import { describe, expect, it } from "vitest";
import {
  applyViewerTabLocks,
  assertCanEdit,
  canEdit,
  isViewerBlockedError,
  isViewerOnly,
  VIEWER_ALLOWED_TAB_IDS,
} from "./viewerAccess";

describe("viewerAccess", () => {
  it("treats intern affiliation as viewer-only", () => {
    expect(isViewerOnly({ affiliation: "intern" })).toBe(true);
    expect(canEdit({ affiliation: "intern" })).toBe(false);
  });

  it("allows edits for extern / null affiliation", () => {
    expect(canEdit({ affiliation: "extern" })).toBe(true);
    expect(canEdit({ affiliation: null })).toBe(true);
  });

  it("throws a recognisable (silent) error for blocked viewer writes", () => {
    let caught: unknown;
    try {
      assertCanEdit({ affiliation: "intern" });
    } catch (error) {
      caught = error;
    }
    expect(isViewerBlockedError(caught)).toBe(true);
    expect(isViewerBlockedError(new Error("other"))).toBe(false);
  });

  it("locks write tabs for viewers", () => {
    const tabs = [
      { id: "flightPlan", disabled: false },
      { id: "viewPlan", disabled: false },
      { id: "vluchtZoeken", disabled: false },
    ];
    const locked = applyViewerTabLocks(tabs, false);
    expect(locked.find((t) => t.id === "flightPlan")?.disabled).toBe(true);
    expect(locked.find((t) => t.id === "viewPlan")?.disabled).toBe(false);
    expect(VIEWER_ALLOWED_TAB_IDS.has("vluchtZoeken")).toBe(true);
    expect(VIEWER_ALLOWED_TAB_IDS.has("waarnemings")).toBe(true);
  });
});
