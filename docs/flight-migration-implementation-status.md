# Finished flight-plan local view: implementation status

The former TST-to-PROD transfer workflow is disabled. No migration SQL exists in this repository, and the application does not create or alter database tables.

On `localhost` and `127.0.0.1`, the dashboard's **Finished flight plans** section is a read-only list backed by existing `lis.flightplans` and `lis.finished_plans` records when a local backend is configured. The standalone frontend falls back to synthetic, clearly labelled preview rows so the screen can be reviewed without Keycloak or a database.

There is no deployment, source export, status call, preview, import, attachment transfer, or data mutation. Live TST/PROD validation is intentionally out of scope.
