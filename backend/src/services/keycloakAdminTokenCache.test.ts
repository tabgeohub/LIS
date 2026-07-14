import assert from "assert";
import {
  cacheAdminToken,
  clearAdminTokenCache,
  getCachedAdminToken,
} from "./keycloakAdminTokenCache";

clearAdminTokenCache();
cacheAdminToken({ profile: "public", token: "token", expiresInSeconds: 60, now: 1000 });
assert.equal(getCachedAdminToken("public", 30_999), "token");
assert.equal(getCachedAdminToken("public", 31_000), undefined);
cacheAdminToken({ profile: "intranet", token: "fallback", now: 0 });
assert.equal(getCachedAdminToken("intranet", 29_999), "fallback");
assert.equal(getCachedAdminToken("intranet", 30_000), undefined);
clearAdminTokenCache();
console.log("keycloakAdminTokenCache tests passed");
