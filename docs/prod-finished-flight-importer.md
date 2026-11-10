# PROD finished-flight package importer

`main` contains a manual, PROD-only importer. It accepts a signed JSON package downloaded from the separately deployed TST source flow. It does not contain the TST exporter, a server-to-server transfer, package storage, transfer history, mapping tables, retry records, or database DDL.

The feature is enabled only when the public request host (or the public browser origin behind a proxy) is exactly `lis.rws.nl`. It requires the exact `admin` realm role and offers only regions that appear both in the user’s access-token realm roles and `lis.regios`.

The import screen is Dashboard → **Import finished flight plan**. Select a downloaded package and an allowed region, preview it, resolve all conflicts, then import. Preview and import independently verify the Ed25519 signature, 24-hour expiry, TST source UUID/environment, ArcGIS attachment origin and availability, production schema, and metadata matching. Import writes only existing business tables inside one transaction. Legacy TST log rows are deliberately skipped; they neither block preview nor create PROD log rows. It never uploads media, sends email, deletes TST rows, or changes unrelated production data.

There is intentionally no durable import record. If an import request times out or the browser loses its response, check PROD manually before retrying. Live Keycloak roles, deployed schema, ArcGIS reachability, and a real package remain release checks; this implementation was verified only with synthetic local fixtures.

If preview rejects `finished_at`, it displays the actual PostgreSQL data type and underlying type name read by the existing preflight. The admin can share this message without running a database query. A missing column is reported as `missing`. This diagnostic does not add or change columns or convert completion timestamps.

The importer supports the existing `time without time zone` completion column as well as timestamp columns. For a time column, nulls and exact time-of-day strings (including microseconds) are preserved. A value with a date or timezone is rejected during preview rather than silently losing that information. No completion date/time is synthesized.

Legacy schemas do not need declared foreign keys on business relationship columns. Preview and the locked import validate package links in code, require the referenced columns, and remap all relationships to destination IDs. Existing database constraints remain active; no constraints are added or removed.

Local regression verification: backend `npm run build` and `npm run test:migrations`; root `npm run check:architecture` and `git diff --check`. `npm run test:migrations:postgres -- /private/tmp/lis-import-no-fk.<suffix>` connects only to a disposable local PostgreSQL cluster on Unix-socket port 55483 and creates/drops its own synthetic database. It covers successful import without foreign keys or a logging table, TIME nulls/microseconds, point/geometry reuse, separate vertex and flight visit order, invalid links, and rollback at each of ten business inserts. The test does not read application database configuration or use real packages. Deployed schema/provider/desktop checks remain pending.
