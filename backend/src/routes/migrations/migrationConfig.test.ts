import assert from "node:assert/strict";
import { migrationConfig, configuredForDestination, configuredForSource } from "./config";
import { regionNames } from "./destination";

const disabled = migrationConfig({});
assert.equal(disabled.enabled, false);
assert.equal(configuredForSource(disabled), false);
assert.equal(configuredForDestination(disabled), false);
const source = migrationConfig({ MIGRATION_ENABLED: "true", MIGRATION_ROLE: "source", MIGRATION_SOURCE_INSTANCE_UUID: "11111111-1111-4111-8111-111111111111", MIGRATION_SOURCE_ISSUER: "tst", MIGRATION_DESTINATION_FRONTEND_URL: "https://prod.example/", MIGRATION_EXPORT_SIGNING_KEY_ID: "first", MIGRATION_EXPORT_SIGNING_PRIVATE_KEY: "key", MIGRATION_EXPORT_READ_CREDENTIAL: "read" });
assert.equal(configuredForSource(source), true);
assert.equal(configuredForDestination(source), false);
const destination = migrationConfig({ MIGRATION_ENABLED: "true", MIGRATION_ROLE: "destination", MIGRATION_SOURCE_INSTANCE_UUID: "11111111-1111-4111-8111-111111111111", MIGRATION_SOURCE_BACKEND_URL: "https://tst.example/", MIGRATION_DESTINATION_ISSUER: "prod", MIGRATION_DESTINATION_REGION_ROLES: '["RWS A","admin","Unknown"]', MIGRATION_EXPORT_READ_CREDENTIAL: "read", MIGRATION_STATUS_READ_CREDENTIAL: "status", MIGRATION_ARCGIS_ALLOWED_ORIGINS_JSON: '["https://arcgis.example"]', MIGRATION_TRUSTED_EXPORT_PUBLIC_KEYS_JSON: '{"first":"public"}' });
assert.equal(configuredForDestination(destination), true);
assert.deepEqual(regionNames([{ id: "RWS A" }, { id: "admin" }, { id: "Other" }], destination.destinationRegions), ["RWS A"]);
