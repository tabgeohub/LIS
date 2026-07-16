import assert from "node:assert/strict";
import {
  filterByHerhalen,
  matchesHerhalen,
} from "../src/helpers/points/herhalenFilter";
import {
  getUnstarredPoints,
  mergeStarredPoints,
} from "../src/helpers/points/starredPointSelection";
import { pointPlanImagesToAttachments } from "../src/api-hooks/planImages/pointPlanImagesToAttachments";
import { pickFlightPlanFormValues } from "../src/hooks/zustand/shared/flightPlanFormValues";

assert.equal(matchesHerhalen(1, true), true);
assert.equal(matchesHerhalen("0", false), true);
assert.deepEqual(
  filterByHerhalen(
    [
      { id: 1, herhalen: 1 },
      { id: 2, herhalen: 0 },
      { id: 3 },
    ],
    true
  ).map((item) => item.id),
  [1]
);

const firstPoint = { id: 1 } as any;
const replacementPoint = { id: 1, omschrijving: "replacement" } as any;
const secondPoint = { id: 2 } as any;
assert.deepEqual(
  mergeStarredPoints([firstPoint], [replacementPoint, secondPoint]),
  [replacementPoint, secondPoint]
);
assert.deepEqual(getUnstarredPoints([firstPoint, secondPoint], [firstPoint]), [
  secondPoint,
]);

const attachments = pointPlanImagesToAttachments([
  {
    id: 2,
    url: "second",
    point_id: 10,
    attachmentid: null,
    taken_at: "2026-01-02T00:00:00Z",
    location: null,
    plan_id: 5,
  },
  {
    id: 1,
    url: "first",
    point_id: 10,
    attachmentid: 20,
    taken_at: "2026-01-01T00:00:00Z",
    location: "A",
    plan_id: 5,
  },
]);
assert.deepEqual(
  attachments.map((attachment) => attachment.id),
  [1, 2]
);

const formValues = {
  omschrijving: "Plan",
  waarnemer: "Observer",
  piloot: "Pilot",
  datum: "2026-07-16",
  geplandeVliegduur: "1:00",
  typeLuchtvaartuig: "Helicopter",
  aantalPassagiers: 2,
  doelEnHoofdthema: "Theme",
  aanvullendeInfo: "Info",
};
assert.deepEqual(
  pickFlightPlanFormValues({ ...formValues, ignored: true } as any),
  formValues
);

console.log("Architecture helper tests passed.");
