import { describe, expect, it } from "vitest";
import { resolveAuthUserFromRealmRoles } from "./resolveAuthUserFromRealmRoles";

describe("resolveAuthUserFromRealmRoles", () => {
  it("resolves admin alone", () => {
    expect(resolveAuthUserFromRealmRoles(["admin", "offline_access"])).toEqual({
      role: "admin",
      affiliation: null,
    });
  });

  it("resolves RWS region alone", () => {
    expect(resolveAuthUserFromRealmRoles(["RWS NN", "default-roles-lis"])).toEqual({
      role: "RWS NN",
      affiliation: null,
    });
  });

  it("marks extern while keeping region", () => {
    expect(
      resolveAuthUserFromRealmRoles(["RWS ZN", "extern", "offline_access"])
    ).toEqual({ role: "RWS ZN", affiliation: "extern" });
  });

  it("marks intern while keeping region", () => {
    expect(resolveAuthUserFromRealmRoles(["RWS ON", "intern"])).toEqual({
      role: "RWS ON",
      affiliation: "intern",
    });
  });

  it("prefers admin when present with region", () => {
    expect(resolveAuthUserFromRealmRoles(["admin", "RWS NN", "intern"])).toEqual({
      role: "admin",
      affiliation: null,
    });
  });

  it("prefers extern over intern when both present", () => {
    expect(
      resolveAuthUserFromRealmRoles(["RWS NN", "intern", "extern"])
    ).toEqual({ role: "RWS NN", affiliation: "extern" });
  });

  it("returns undefined role without RWS or admin", () => {
    expect(resolveAuthUserFromRealmRoles(["extern", "intern"])).toEqual({
      role: undefined,
      affiliation: null,
    });
  });
});
