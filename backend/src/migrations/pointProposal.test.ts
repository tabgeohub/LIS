import assert from "node:assert/strict";
import { adHocCandidateName, proposePoints, renamedPoints, requireConfirmedRenames } from "./pointProposal";
import { matchGeometry, type MatchPoint } from "./matching";

const point = (overrides: Partial<MatchPoint> = {}): MatchPoint => ({ id: "1", name: "Ad hoc waarneming 1", region: "TST", latitude: 1, longitude: 2, rdX: 3, rdY: 4, geometryId: null, ...overrides });
const source = point();
const existing = point({ id: "100", region: "RWS NN" });
const propose = (destination: MatchPoint[], points = [source], limit: number | null = null) => proposePoints(points, destination, "RWS NN", "export-123", limit);
assert.equal(propose([])[0].renamed, false);
assert.equal(propose([])[0].destinationName, source.name);
const expectedName = adHocCandidateName("export-123", "1", source.name, 0);
assert.match(expectedName, /^Ad hoc waarneming 1-\d{6}$/);
for (const destination of [[existing], [existing, point({ id: "101", region: "unrelated region", latitude: 99 })]]) {
  const before = JSON.stringify([source, destination]);
  const mappings = propose(destination);
  assert.equal(mappings[0].action, "create");
  assert.equal(mappings[0].renamed, true);
  assert.equal(mappings[0].destinationName, expectedName);
  assert.deepEqual(propose(destination), mappings, "preview is deterministic");
  assert.equal(JSON.stringify([source, destination]), before);
  requireConfirmedRenames(mappings, renamedPoints(mappings));
  for (const confirmation of [undefined, [], [{ sourceId: "1", destinationName: "arbitrary name" }], [{ sourceId: "2", destinationName: expectedName }], [...renamedPoints(mappings), ...renamedPoints(mappings)]]) {
    assert.throws(() => requireConfirmedRenames(mappings, confirmation), /PREVIEW_CHANGED/);
  }
}
const mixedCase = point({ name: "  aD hOc cafe\u0301  " });
const normalized = propose([point({ id: "101", name: "aD hOc café" })], [mixedCase])[0];
assert.equal(normalized.renamed, true);
assert.match(normalized.destinationName, /^aD hOc café-\d{6}$/);
assert.equal(propose([point({ ...existing, region: "another region" })])[0].renamed, true);
const collisions = [existing, ...Array.from({ length: 100 }, (_, index) => point({ id: String(index + 200), name: adHocCandidateName("export-123", "1", source.name, index) }))];
assert.equal(propose(collisions.slice(0, 2))[0].destinationName, adHocCandidateName("export-123", "1", source.name, 1));
assert.equal(propose(collisions)[0].action, "conflict");
assert.equal(propose([existing], [source], [...expectedName].length - 1)[0].action, "conflict");
assert.equal(propose([existing], [source], [...expectedName].length)[0].renamed, true);
const duplicate = propose([], [source, point({ id: "2" })]);
assert.equal(duplicate[0].destinationName, source.name);
assert.equal(duplicate[1].renamed, true);
assert.notEqual(duplicate[0].destinationName, duplicate[1].destinationName);
const reserved = propose([existing], [source, point({ id: "2", name: expectedName })]);
assert.notEqual(reserved[0].destinationName, expectedName, "suffixes must not shadow another package point name");
const regular = point({ name: "Regular point" });
assert.equal(propose([regular, { ...regular, id: "2" }], [regular])[0].action, "conflict");
assert.equal(propose([existing], [point({ geometryId: "11" })])[0].action, "conflict");
assert.equal(propose([existing], [point({ latitude: NaN })])[0].action, "conflict");
const geometry = { id: "11", name: "G", region: "RWS NN", type: "line", vertices: [point({ geometryId: "11" })] };
assert.equal(matchGeometry(geometry, [geometry, { ...geometry, id: "12" }], "RWS NN").kind, "conflict");
const changed = propose([existing, point({ id: "102", name: expectedName })]);
assert.throws(() => requireConfirmedRenames(changed, renamedPoints(propose([existing]))), /PREVIEW_CHANGED/);
console.log("Ad hoc point proposal fixtures passed");
