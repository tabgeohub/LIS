import assert from "assert";
import {
  clampFromStep,
  clampToStep,
  createTimesliderConversions,
  normalizeSliderValues,
  parseTimesliderRange,
} from "./timesliderRangeHelpers";

const reversed = parseTimesliderRange("2025-01-10", "2025-01-01");
assert.deepEqual(
  [reversed.minDate.getFullYear(), reversed.minDate.getMonth() + 1, reversed.minDate.getDate()],
  [2025, 1, 1]
);
assert.deepEqual(
  [reversed.maxDate.getFullYear(), reversed.maxDate.getMonth() + 1, reversed.maxDate.getDate()],
  [2025, 1, 10]
);
const conversions = createTimesliderConversions(
  new Date("2025-01-01T00:00:00Z"),
  new Date("2025-01-11T00:00:00Z"),
  10
);
assert.equal(conversions.stepIndexToDate(5).toISOString(), "2025-01-06T00:00:00.000Z");
assert.equal(conversions.dateToStepIndex(new Date("2025-01-06T00:00:00Z")), 5);
assert.deepEqual(normalizeSliderValues([8, 2], 10), [2, 2]);
assert.equal(clampFromStep(10, 5), 4);
assert.equal(clampToStep(0, 5, 10), 6);
console.log("timesliderRangeHelpers tests passed");
