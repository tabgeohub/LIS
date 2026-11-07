# Finished flight-plan local view

This repository does not contain a database migration for flight transfer and does not create any tables.

`backend/src/routes/migrations/config.ts` enables exactly one API on `localhost` and `127.0.0.1`: `GET /api/migrations/flights`. It reads the existing `lis.flightplans` and `lis.finished_plans` tables and returns finished flights only. Every deployed hostname is disabled. There are no export, preview, transfer, status, or mutation endpoints.

Running the frontend by itself (`npm run dev`) requires no environment variables and shows clearly labelled synthetic rows. When the normal backend is configured with a local LIS database and an authenticated admin session, the same page displays that database's finished flights read-only.
