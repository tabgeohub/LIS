import assert from "assert";
import { buildImageNavigation, buildTimesliderPageStatus } from "./timesliderPageStatus";

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
assert.equal(status.blockImages, true);
assert.equal(status.emptyMain, "Dit item komt niet voor in de plannen van deze periode.");

let selected = 2;
const navigation = buildImageNavigation({
  blockImages: false,
  imagesLength: 3,
  selectedIndex: 9,
  setSelectedIndex: (value) => {
    selected = typeof value === "function" ? value(selected) : value;
  },
});
assert.equal(navigation.safeIndex, 2);
navigation.imageNav?.onPrevious();
assert.equal(selected, 1);
console.log("timesliderPageStatus tests passed");
