# One-shot finished-flight transfer

This feature creates no tables and adds no fields. `tst-lis.rws.nl` can download a signed package for one finished flight. `lis.rws.nl` can upload that package, validate it, preview matching against existing production records, and import it in one transaction into the existing LIS business tables.

The package is never saved by either server. There is no transfer history, source-to-PROD mapping, durable duplicate protection, or lost-response recovery. Do not retry an uncertain import without first inspecting PROD manually.

`localhost` and `127.0.0.1` remain read-only: they list existing local finished plans when the normal backend is configured, or use clearly labelled synthetic rows when the frontend is run alone with `npm run dev`.

The host roles, source instance UUID, signing key pair, and ArcGIS attachment origin are code-owned in `backend/src/routes/migrations/config.ts`, as requested. The private signing key must be rotated and moved to appropriate deployment secrets before a real release.
