import { describe, expect, it } from "vitest";
import { parseTimesliderImageQuery } from "./parseTimesliderImageQuery";

function parse(query: string) {
  return parseTimesliderImageQuery(new URLSearchParams(query));
}

describe("Timeslider image query parsing", () => {
  it("parses valid point and geometry links", () => {
    expect(parse("kind=point&id=2&from=2026-01-01&to=2026-02-01")).toEqual({
      ok: true,
      kind: "point",
      id: 2,
      from: "2026-01-01",
      to: "2026-02-01",
      planId: null,
    });
    expect(
      parse("kind=geometry&id=3&from=2026-01-01&to=2026-02-01&plan_id=9")
    ).toEqual(expect.objectContaining({ ok: true, kind: "geometry", planId: 9 }));
  });

  it("keeps an empty optional plan id as null", () => {
    expect(
      parse("kind=point&id=2&from=2026-01-01&to=2026-02-01&plan_id=")
    ).toEqual(expect.objectContaining({ ok: true, planId: null }));
  });

  it.each([
    ["kind=other&id=2&from=2026-01-01&to=2026-02-01", "Ongeldige link (kind)."],
    ["kind=point&id=0&from=2026-01-01&to=2026-02-01", "Ongeldige link (id)."],
    ["kind=point&id=2&from=01-01-2026&to=2026-02-01", "Ongeldige link (periode)."],
    ["kind=point&id=2&from=2026-01-01&to=2026-02-01&plan_id=-1", "Ongeldige link (plan_id)."],
  ])("preserves the validation response for %s", (query, reason) => {
    expect(parse(query)).toEqual({ ok: false, reason });
  });
});
