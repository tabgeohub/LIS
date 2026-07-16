import { describe, expect, it } from "vitest";
import {
  buildImageNavigation,
  buildTimesliderPageStatus,
} from "./timesliderPageStatus";

describe("timeslider page status", () => {
  it("blocks images when no plans match", () => {
    const status = buildTimesliderPageStatus({
      invalidQuery: false,
      queryError: null,
      needsAuth: false,
      plansError: null,
      noPlansInRange: false,
      noMatchingPlans: true,
      allPlansLoading: false,
      imagesLoading: false,
      imagesLength: 0,
    });
    expect(status.blockImages).toBe(true);
    expect(status.emptyMain).toBe(
      "Dit item komt niet voor in de plannen van deze periode."
    );
  });

  it("clamps navigation and moves to the previous image", () => {
    let selected = 2;
    const navigation = buildImageNavigation({
      blockImages: false,
      imagesLength: 3,
      selectedIndex: 9,
      setSelectedIndex: (value) => {
        selected = typeof value === "function" ? value(selected) : value;
      },
    });
    expect(navigation.safeIndex).toBe(2);
    navigation.imageNav?.onPrevious();
    expect(selected).toBe(1);
  });
});
