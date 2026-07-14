import assert from "assert";
import { filterPointsByCriteria } from "./filterPointsByCriteria";

const points = [
  {
    id: 1,
    herhalen: 1,
    activiteit_id: "inspectie",
    omschrijving: "Brug controleren",
    created_at: "2026-07-10T00:00:00Z",
  },
  {
    id: 2,
    herhalen: 0,
    activiteit_id: "meting",
    omschrijving: "Dijk meten",
    created_at: "2026-05-01T00:00:00Z",
  },
] as any;

const recurring = filterPointsByCriteria(points, {
  herhalen: true,
  activityFilter: "inspectie",
  periodFilter: "Laatste 4 weken",
  dateFrom: "",
  dateTo: "",
  filterText: "brug",
  now: new Date("2026-07-14T00:00:00Z").getTime(),
});
assert.deepEqual(recurring.map((point) => point.id), [1]);

const bounded = filterPointsByCriteria(points, {
  herhalen: false,
  activityFilter: "",
  periodFilter: "Periodoe van-tot",
  dateFrom: "2026-04-01",
  dateTo: "2026-05-31",
  filterText: "",
});
assert.deepEqual(bounded.map((point) => point.id), [2]);
console.log("filterPointsByCriteria tests passed");
