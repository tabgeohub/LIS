# PROD finished-flight package importer

`main` contains a manual, PROD-only importer. It accepts a signed JSON package downloaded from the separately deployed TST source flow. It does not contain the TST exporter, a server-to-server transfer, package storage, transfer history, mapping tables, retry records, or database DDL.

The feature is enabled only when the public request host (or the public browser origin behind a proxy) is exactly `lis.rws.nl`. It requires the exact `admin` realm role and offers only regions that appear both in the user’s access-token realm roles and `lis.regios`.

The import screen is Dashboard → **Import finished flight plan**. Select a downloaded package and an allowed region, preview it, resolve all conflicts, then import. Preview and import independently verify the Ed25519 signature, 24-hour expiry, TST source UUID/environment, ArcGIS attachment origin and availability, production schema, and metadata matching. Import writes only existing business tables inside one transaction. Legacy TST log rows are deliberately skipped; they neither block preview nor create PROD log rows. It never uploads media, sends email, deletes TST rows, or changes unrelated production data.

There is intentionally no durable import record. If an import request times out or the browser loses its response, check PROD manually before retrying. Live Keycloak roles, deployed schema, ArcGIS reachability, and a real package remain release checks; this implementation was verified only with synthetic local fixtures.
