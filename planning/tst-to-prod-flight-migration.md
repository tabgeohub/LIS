# Admin-controlled flight migration from TST to PROD

## Purpose and current status

Implement a temporary migration feature for the remaining 1–2 months of iPad testing. Admins initiate migration from the TST website dashboard. PROD independently authenticates the admin, requires a destination region, previews the transfer, and imports the flight.

Implementation belongs in the **LIS** repository, which contains the website and backend. No iOS or desktop application changes are required for v1. The desktop application version 1.1.1 must continue working throughout the transition.

- `LIS/main` supplies the production website and backend.
- `LIS/tst-main` supplies the test website and backend with iOS support.
- The environments have separate databases and Keycloak realms.
- Both use one ArcGIS Online feature layer for photos.
- Flights created entirely in TST may have no production counterpart.

**Implementation progress as of this handoff:** The local LIS `tst-main` checkout contains uncommitted prerequisite changes to exact-admin role handling in `backend/src/helpers/auth/realmAdminAuth.ts`, `backend/src/routes/auth2/authIdentity.ts`, and `src/applyAuthMeBootstrap.ts`, plus `backend/src/helpers/auth/migrationAdminRoles.test.ts`. Backend typechecking and the focused role test passed. Inspect the existing changes before continuing; do not overwrite them. The migration feature, regional access fixes, database migrations, dashboard flow, and end-to-end validation have not been implemented.

**Development versus deployment:** Neither deployed database schema nor the live Keycloak configuration was available in the previous workspace. This does **not** block local implementation. Build the complete feature using the existing persistence contracts, explicit schema assumptions, injectable database/provider adapters, and isolated fixtures. Implement runtime schema checks that reject unsupported layouts. Live schema/configuration inspection is required before enabling migration or performing real TST/PROD transfers, not before writing and testing the feature. The companion `tst-to-prod-schema-inspection.sql` queries metadata only and has not been run.

### Instructions for the implementation chat

- Work in `/Users/aboudi17/Github/LIS`, or an authorized writable checkout of that repository. This document lives in LIS-iOS for handoff convenience; the implementation belongs in LIS.
- Inspect current Git changes and preserve existing work. The progress paragraph above describes the original handoff and may have been superseded by commits or later changes.
- If deployed databases, Keycloak realms, provider access, or service credentials are unavailable, continue all independent implementation. Do not stop after prerequisite authorization changes or after updating the inspection script.
- Implement the dashboard, APIs, signed exports, matching, persistence scripts, importer, schema preflight, and fixture-based tests. Keep the feature disabled by default. Document every unverified deployment assumption and any tests that could not run.
- Do not run migrations against deployed databases, deploy, or transfer real flights during local development. Treat live schema verification, real database acceptance tests, environment credentials, and deployed role verification as release gates. Their absence must not become a blanket implementation blocker.
- If filesystem permissions prevent edits in LIS, use the supported approval flow or have the chat opened with LIS as its writable project. Do not bypass the filesystem boundary.

## Product rules

- A flight is eligible when its TST status is `finished`. This does not prove that all iPad delivery stages have completed: logs can follow plan completion. Export a consistent snapshot of the records already saved in TST, validate structural completeness, and show actual counts. Do not claim that device delivery has been verified.
- Only users with the exact application realm role `admin` can export, preview, or commit migrations. Source and destination administrators do not need matching accounts or subjects.
- The administrator must select a valid production destination region. That region controls access to the flight and newly created entities; production admins retain access.
- Match and reuse compatible production points and geometries; create absent ones. Block on ambiguous or incompatible names, regions, coordinates, geometry types, or vertices.
- Omit `copied_from`, activities, organisations, pilots, observers, and aircraft for newly created records. Preserve existing fields when reusing production entities. Verify that empty optional fields are supported by the deployed schema and production screens.
- Reuse the existing ArcGIS photo references; do not upload or duplicate photos. Separate regional restrictions on ArcGIS images are out of scope. Enforce flight-region access through LIS.
- Transfer each source flight once. Subsequent TST edits do not automatically update production.
- Keep the dashboard simple: a list and compact confirmation, without maps or detailed flight editing.

## Connected handoff and security

1. A TST admin selects **Migrate to PROD** on a finished flight.
2. TST captures and stores an immutable signed export of its saved records.
3. The browser opens a configured PROD confirmation URL carrying only non-secret source/export identifiers.
4. PROD requires its own admin session and preserves the handoff through the existing safe post-login redirect.
5. The PROD backend retrieves the export from the configured TST backend. The admin selects a destination region and requests a preview.
6. PROD validates the export and entity mappings. The admin confirms the preview.
7. PROD revalidates and imports atomically. The TST dashboard refreshes status through a restricted server-to-server endpoint.

Keep browsers on their environment's normal same-origin APIs. Do not forward browser cookies, passwords, or Keycloak tokens between environments, broaden CORS for migration, or give TST production database credentials or permission to write production business data.

### Configuration

Add explicit source/destination feature flags and configuration for:

- A stable source database incarnation UUID. Change it if TST is rebuilt with potentially recycled IDs.
- Fixed allowlisted source backend and destination frontend URLs, including public/intranet mappings.
- A dedicated server-only credential allowing PROD to retrieve prepared TST exports.
- A separate server-only credential allowing TST to read limited PROD migration statuses.
- A dedicated TST Ed25519 export-signing key and trusted PROD public key, identified by key ID.

Service credentials authorize only their narrow internal endpoints; they never authorize creation or commitment of a migration. Verify export signatures and integrity. Do not reuse `SESSION_SECRET`, iOS recovery contexts, or existing upload permits.

Exports expire after 24 hours; previews expire after 15 minutes. Expiration requires a new export/preview. Do not place credentials or signed payloads in redirect URLs or application logs. Accept exports up to 64 MiB excluding photo bytes; reject larger exports explicitly.

### API additions

Use `/api/migrations` for session-authenticated, exact-admin operations:

| Environment | Endpoint | Purpose |
| --- | --- | --- |
| TST | `GET /flights` | Paginated finished-flight list and migration status; default 25, maximum 50 |
| TST | `POST /flights/:id/handoffs` | Create immutable export and return its ID and configured PROD handoff URL |
| PROD | `GET /regions` | Return selectable production regions |
| PROD | `POST /previews` | Accept source instance, export ID, and destination region; return preview or conflicts |
| PROD | `GET /previews/:id` | Retrieve authorized preview or committed result |
| PROD | `POST /previews/:id/commit` | Commit the stored preview without payload or region overrides |
| PROD | `GET /operations/:id` | Recover a result after timeout or interrupted response |

Add narrow service-authenticated `/internal/migrations` endpoints to retrieve prepared exports, check their current source digest, and query committed migration statuses. Accept configured source identifiers, never arbitrary upstream URLs or database queries.

Use existing session-freshness checks before exact admin authorization. Protect state-changing browser requests with same-origin validation and a session-bound CSRF token. Return structured errors for authentication, forbidden access, invalid region, expiration, changed source, matching conflicts, unsupported schema, unavailable photos, and destination conflicts.

### Region authorization

Determine admin status by exact membership of the `admin` realm role, independently of role order. Do not use substring matching or derive admin status from the first selected region. Build destination choices from actual production region records and corresponding production application realm roles; exclude `admin` and generic Keycloak roles. Do not implicitly translate spaces and underscores.

Fix the known region-authorization gaps before enabling migration:

- Authorize the parent flight for finished-flight detail, GPS path, and photo-reference reads, as well as associated changes and deletions.
- Filter point-to-flight history by authorized region.
- Enforce point/geometry region access where applicable.
- Never treat a regionless or unrecognized-role session as unrestricted.
- Check current backend realm roles, not request-body role claims. A user from another region must be denied direct API access, not merely hidden from a list.
- Make dashboard admin detection independent of role ordering.

The previous source review found individual finished-flight details, GPS paths, and photo-reference endpoints protected by login without equivalent parent-flight region checks. Verify current code and deployed behavior as part of implementation.

## Data contract and import rules

### Schema discovery

Inspect available schema evidence and existing SQL first. When live access is available, inspect TST and PROD columns, types, nullability, defaults, primary/unique/check/foreign-key constraints, indexes, triggers, generated columns, and row security. Confirm whether `lis.finished_plans.finished_at` exists and can store source values, and whether historical source user IDs can be retained without creating destination accounts. Until then, build against explicitly documented fixtures and implement compatibility checks; do not represent those fixtures as verified deployed schemas.

Application queries establish dependencies but are not complete schema definitions. Fail preflight for unsupported layouts. Never silently drop timestamps, invent lookup IDs, weaken existing constraints, or create Keycloak accounts.

### Export format

Define a versioned `FlightMigrationExportV1` containing source instance/environment/issuer/flight ID, export ID and timestamps, exporting admin identity, flight metadata and ordered members, points, full required geometry definitions and ordered vertices, completion and attachment-reference rows, GPS path and flight time, saved flight-related logs and source log-group identities, original creator provenance, counts, canonical SHA-256 digest, signing key ID, and signature.

Exclude passwords, cookies, access/refresh tokens, provider tokens, iOS permits, and recovery contexts. Omit skipped lookup references from the operational import model. Capture the source in a repeatable-read, read-only transaction using raw persistence records rather than the aggregated finished-flight screen response.

### Core tables

| Table | Import behavior |
| --- | --- |
| `lis.flightplans` | Generate a new PROD ID; use selected region; preserve historical dates and ordered membership; mark `finished`; leave skipped fields empty |
| `lis.points` | Reuse compatible records or generate new IDs; new records use selected region |
| `lis.geometries` | Resolve complete geometry groups; reuse or create metadata and vertices consistently |
| `lis.finished_plans` | Preserve observations, comments, urgency, recipients, order, and completion timestamps; rewrite references |
| `lis.attachments` | Generate local PROD row IDs; preserve verified ArcGIS feature/attachment identity, URL, capture time, and location |
| `lis.finished_plans_path` | Preserve path and actual flight time; rewrite plan reference |
| `lis.logging` | Preserve saved historical events and actor context; rewrite applicable plan/point references and allocate destination log groups |

For new plan/point owner fields, use the authenticated PROD importing admin's subject where the schema permits. Record original TST creators with issuer context separately. Import ownership must not suggest that the importing admin performed the original flight.

Historical log actors remain source provenance. Do not provision matching users or silently rewrite source actors as the importing admin; reject incompatible constraints during preflight. Do not copy lookup tables or legacy `lis.users` accounts/passwords. Leave skipped fields null/empty according to their actual types, without fake IDs.

Do not use existing creation helpers that replace historical timestamps with `NOW()` or completion helpers that overwrite reused point metadata or status.

### Point and geometry matching

Normalize names using Unicode NFC and trimmed surrounding whitespace; compare case-sensitively. Multiple normalized matches are conflicts. The production ID is authoritative after matching:

- Same name and compatible data: reuse even when IDs differ.
- Same numeric ID with a different name: not a match.
- Name absent: create with a generated PROD ID.
- Same name with incompatible region, coordinates, or geometry: block.
- Same name in another region: block; never move the existing entity or automatically create a duplicate name.

Compare finite geographic and RD coordinates numerically, without approximate matching in v1. Exclude skipped classification fields from compatibility checks. Resolve geometry and vertex mappings as a complete group; do not move vertices between existing geometries.

Preserve geometry vertex order and flight/completion order independently. Existing geometry views sometimes sort vertices by point ID; insert new vertices in the source geometry's established order and verify rendering. Reused entities remain unchanged, including status; store visit-specific information in completion records.

### Photos and other artifacts

Read-check existing ArcGIS attachment references before marking a preview ready. Distinguish local database attachment IDs, ArcGIS feature IDs, and ArcGIS attachment IDs. Rebuild `finished_plans.attachments_id` using PROD local row IDs.

Do not duplicate provider photos, send urgent emails, replay iPad deliveries, copy report ZIPs, or import unsent device-local data. Keep TST records and shared photos after success. Automated source deletion and photo cleanup are out of scope.

## Persistence, atomicity, and logging

Add additive database migrations for:

- Source export storage: immutable canonical payload, digest/signature, source identity, actor, and expiration.
- Destination previews: verified export, selected region, approving actor, proposed mappings/counts/conflicts, and expiration.
- Committed transfers: unique source-instance/flight identity, destination flight, region, export digest, both actor contexts, and completion time.
- Entity mappings: source/destination IDs and whether each entity was created or reused, including log groups.

A destination uniqueness constraint must prevent two successful imports of one source flight across all admins and regions.

Commit procedure:

1. Recheck admin role, preview ownership/expiry, source digest, and photo availability before database write locks.
2. Open a destination transaction and lock the preview.
3. Return an existing transfer result if already imported; reject a different destination region or changed export as a new import.
4. Serialize migration writers and acquire short-lived destination table locks in a fixed order to coordinate with legacy production writers.
5. Recompute matches and conflicts under the locks; require a new preview if anything changed.
6. Create/map geometry and points, flight, photo references, observations, path/time, and logs.
7. Write the committed transfer and mappings in the same transaction; commit once.

Never perform external network requests while holding destination write locks. A lost response must be recoverable from the operation/transfer record; rollback must leave no business rows. Never report success from browser state alone.

Patch production's existing log writer to use the same transactional advisory-lock allocation as the importer while preserving its API contract. An importer-only lock cannot coordinate the old unlocked `MAX(flight_id) + 1` writer.

## Dashboard

Extend the existing dashboard navigation/state instead of building a separate application. Primary integration points in LIS are `src/Components/DashboardPage/index.tsx`, `src/hooks/zustand/ui/usersManagementState.ts`, and `backend/src/configure/registerApplicationRoutes.ts`.

The TST list shows flight number, flight date, source region, migration status, and action. Statuses are **Ready**, **Needs review**, **Migrated**, and **Status unavailable**. Ready means eligible by status and not known to be migrated; it is not proof of completed device delivery. If destination status cannot be checked, show uncertainty; destination uniqueness still prevents duplicates.

The PROD confirmation shows only the flight number/date and source environment; a required destination-region selector with no default; reused/new point and geometry counts; observation/photo/log counts and GPS/time indicators; blocking conflict messages; and explicit confirmation showing PROD and the chosen region. Do not add maps, flight editing, automatic conflict resolution, or bulk migration.

After success, show destination flight ID, region, migration time, and a production flight link. Disable another transfer. If the source changes later, show **Migrated; source changed** without automatic synchronization.

## Implementation sequence

1. Inspect current repository contracts and available schema/configuration evidence. Record unavailable live checks as release gates, document fixture assumptions, and continue local implementation.
2. Add transfer contracts, additive persistence migrations, and exact admin/region authorization helpers.
3. Patch production regional access gaps and shared log allocation; regression-test desktop behavior.
4. Implement source snapshot/signing and restricted transport endpoints.
5. Implement destination preview, matching, validation, and atomic commit.
6. Integrate dashboard handoff, confirmation, and durable status display.
7. Add acceptance coverage and deployment documentation. Complete deployed-schema/configuration verification and real PostgreSQL acceptance before activation; leave these explicitly pending when the environment is unavailable.

Keep changes additive and narrowly scoped. Do not merge the entire iOS backend into production to deliver this feature.

## Verification and rollout

Use mocked identity/provider fixtures for unit tests and disposable real PostgreSQL databases for transaction/concurrency tests. Cover exact admin matching and role ordering; separate realms; destination-region authorization including direct cross-region API calls; signed-export tampering/expiry; source and destination changes after preview; all matching conflicts and ID collisions; full geometry and vertex order; reused metadata; skipped optional fields; attachment identity and missing photos; GPS/time, timestamps and log mapping; rollback at every stage; simultaneous administrators, double-clicks and lost responses; concurrent desktop/import log allocation; production screens with empty optional fields; and absence of email sends, source deletion, or unrelated production modifications.

Run architecture checks, frontend build, backend typecheck, relevant authentication/query tests, and new migration tests.

Before a real import, use isolated source/destination database fixtures; deploy additive storage and production prerequisites with migration disabled; provision keys, credentials, and fixed URLs; verify public/intranet handoff and PROD login; and exercise desktop 1.1.1 login, plan download, normal completion, photos, and logs against the candidate backend.

Enable the feature for admins and perform one controlled migration. Verify as production admin, selected-region user, and unrelated-region user. Compare geometry/order, observations, photos, GPS/time, and source/destination counts. Repeat the request and verify no duplicate records.

Log operation/source identifiers, region, duration, counts, and structured failures, never credentials, provider tokens, or full flight payloads. Disabling the feature stops new transfers without deleting completed imports, provenance, or shared photos. No automatic destructive rollback.

The feature is complete when an admin can select a finished TST flight, authorize in PROD, choose its region, and migrate it exactly once; region access and linked records are correct; and existing entities and Windows workflows remain intact. Document applied schemas, configuration/key setup, API contracts, test results, deployment, and limitations. Block deployment wherever schema, role configuration, or access checks fail preflight.
