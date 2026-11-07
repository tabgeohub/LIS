# Flight migration configuration

Migration settings live in `backend/src/routes/migrations/config.ts` under `MIGRATION_CODE_CONFIG`. They are code-owned for this temporary feature and enabled only for the configured TST and PROD hostnames.

The configured host selects the role: `tst-lis.rws.nl` is the source and `lis.rws.nl` is the destination. Keycloak issuers are read from the authenticated session token, and destination choices are the intersection of Keycloak realm roles and production region records.

The code contains the signing key pair and separate export/status credentials alongside the TST and PROD URLs, browser origins, ArcGIS attachment origin, source UUID, and host roles. Unknown hostnames remain disabled. `localhost` and `127.0.0.1` are a separate source-only, read-only mode: they list finished flights from the locally configured LIS database, never call PROD for status, and reject export, preview, and commit requests. When the frontend is run alone on localhost, it shows clearly labelled synthetic finished-flight fixtures instead, so the dashboard can be inspected without a database or Keycloak.

Use separate random values for export retrieval and status retrieval. Keep them server-side in this backend file; do not put them in frontend code, redirects, logs, or commits. Setting only `enabled: true` still returns `MIGRATION_DISABLED` until every required value is present.

Before enabling either checkout, apply and verify the additive SQL in a disposable database and complete candidate-environment schema, Keycloak-role, URL handoff, ArcGIS, and desktop validation. This does not authorize a real transfer during local development.
