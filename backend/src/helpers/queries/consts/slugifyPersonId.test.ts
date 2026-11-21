import assert from "assert";
import { slugifyPersonIdBase } from "./slugifyPersonId";

assert.equal(slugifyPersonIdBase("Holm, Albrecht"), "albrecht.holm");
assert.equal(slugifyPersonIdBase("Frank Coolen"), "frank.coolen");
assert.equal(
  slugifyPersonIdBase("Frank Coolen (Helicenter)"),
  "frank.coolen"
);
assert.equal(slugifyPersonIdBase("Gerrits, Vissers"), "vissers.gerrits");
assert.equal(slugifyPersonIdBase("José María"), "jose.maria");
assert.equal(slugifyPersonIdBase("   "), "item");
assert.equal(slugifyPersonIdBase("@@@"), "item");

console.log("slugifyPersonId tests passed");
