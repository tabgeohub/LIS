import assert from "node:assert/strict";
import { isProdHostname, isTrustedTstSource, migrationConfig, PROD_MIGRATION_CONFIG } from "./config";

assert.equal(isProdHostname("lis.rws.nl"), true);
assert.equal(isProdHostname("tst-lis.rws.nl"), false);
assert.equal(migrationConfig("lis.rws.nl").enabled, true);
assert.equal(migrationConfig("localhost").enabled, false);
assert.equal(PROD_MIGRATION_CONFIG.sourceEnvironment, "TST");
assert.equal(Object.keys(PROD_MIGRATION_CONFIG.trustedPublicKeys).length, 1);
assert.equal(isTrustedTstSource({ instance: PROD_MIGRATION_CONFIG.sourceInstance, environment: "TST" }), true);
assert.equal(isTrustedTstSource({ instance: "other", environment: "TST" }), false);
console.log("migration configuration fixtures passed");
