import { describe, expect, it } from "vitest";
import {
  applyViewerTabLocks,
  canEdit,
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
  });
});
