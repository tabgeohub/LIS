import assert from "assert";
import {
  buildPopupDisplayAttributes,
  formatPopupFieldName,
  formatPopupValue,
  resolvePopupPosition,
} from "./featureLayerPopupFormatting";

assert.equal(formatPopupFieldName("inspectie_datum"), "Inspectie Datum");
assert.equal(formatPopupValue(true), "Ja");
assert.deepEqual(resolvePopupPosition({ x: 10, y: 80 }), { x: 30, y: 30 });
assert.deepEqual(
  buildPopupDisplayAttributes({ OBJECTID: 1, created_user: "x", naam: "Brug" }),
  [{ label: "Naam", value: "Brug" }]
);
console.log("featureLayerPopupFormatting tests passed");
