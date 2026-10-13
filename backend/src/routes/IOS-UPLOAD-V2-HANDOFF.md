# iOS upload contract 2 implementation handoff

Source branch: LIS `tst-main`, 2026-10-13. Companion app: LIS-iOS.

Database structure is unchanged. No schema files, migrations, deployment files, environment files or Desktop source were changed. Tests use synthetic signing/authentication, mocked SQL/fetch/provider; no user database, existing credentials or live provider writes. Ordinary existing-record inserts/updates remain necessary.

## Interfaces

- Capability GET `api/arcgis/ios/credential`: version 2, `existing_records_v2`, 16 MiB limit, no persistent claims or durable operation receipts, process-bound single-use write permits.
- Photo GET/POST `api/arcgis/ios/photo-operations/:operationKey`: POST JSON `prepare` then JSON `feature` with permit; feature 202/pending acknowledgment contains feature ID, signed recovery context and attachment permit. Multipart `attachment` metadata and original `evidence` bytes follow only after app checkpoint. Actual PNG/JPEG/HEIC signatures/hash/count are checked before attachment upload. Known-feature content readback returns 200/confirmed receipt or 202 uncertain; no MAX/latest guesses or unverified GlobalID assumptions. GET uses `X-LIS-Recovery-Context`.
- Recovery HMAC derives a purpose-separated key from existing session secret. Wrong subject/purpose/operation/file/owner/context is rejected. Feature/image IDs remain distinct; URLs contain no provider token. Provider requests use existing server-held token in request bodies. Secret rotation requires review of old contexts.
- First-write permits are process-bound and consumed before write. A repeated/expired/missing permit cannot write. Read-only preparation can repeat before consumption; restart invalidates permits. They are an ephemeral safety proof, NOT a durable receipt or a multi-process/device ownership lease. Capacity refuses new work rather than evicting consumed identities. Clients never acquire a fresh permit for previously uncertain attempted work.
- Plan POST `api/finished_plans/ios/submit`: same envelope, full numeric original member list, signed photo results, existing plan row lock + ordinary writer transaction. Finished duplicates compare all persisted ordinary fields; conflicts/duplicate rows do not append. Read-only POST `api/finished_plans/ios/reconcile` accepts the expected frozen projection. Historical GET `api/finished_plans/ios/receipts/:operationKey` returns 202/projection-required. Provenance: direct_commit vs state_verified, not durable operation receipt. Rich package/timer evidence is not stored in the database.
- Attachments map feature ID → `attachmentid`, token-free image URL → `url`, owner point → `point_id`, imported-at integer milliseconds → existing bigint `taken_at`; location remains lat,long. No schema change.
- Shared status updates retain identity/region/admin checks and existing plan row locks, not claim-table requirements. Old claim modules/endpoints are not part of the new upload flow.
- Log POST/GET `api/logs/ios/operations/:operationKey`: read-only prepare returns permit; write consumes it, atomically allocates existing flight_id and inserts records. Signed context identifies the exact group/normalized row digest for GET readback. Context-carrying POST is reconciliation only. No context after a lost response => pending/review, not retry. Empty iOS batches are invalid.
- Legacy POST `api/logs`: unchanged request shape and 201/message, additive flight_id/record_count. Legacy and iOS share transactional `pg_advisory_xact_lock(hashtext('lis.logging.flight_id'))` before MAX allocation. Website/Desktop finished writer remains unchanged except numeric attachment timestamp DTO compatibility.

## Verification

From backend cwd:

```sh
npx tsc --noEmit
npm run test:ios-photo-operations
npm run test:ios-finished-plan-operations
npm run test:ios-log-operations
npm run test:arcgis-ios-contract
npm run test:auth2-ios-contract
```

Typecheck passes. Photo 6/6, plan 6/6, logs 5/5; capability and auth contracts pass using loopback fixtures (sandbox escalation required to listen). Provider adapter mock validates body-only synthetic token usage, metadata/bytes and IDs. SQL tests cover simulated concurrent row locking, projection conflicts and rollback, not real PostgreSQL semantics. Backend canonical hashes match the two Swift/Node fixtures. Valid iOS focused bundle `/private/tmp/lis-upload-v2-final-r2.xcresult`: 84 pass/0 fail. Broad unit bundle `/private/tmp/lis-upload-v2-regression-r2.xcresult`: 130 functions, 123 pass/7 previously documented session/timer/track/GPS failures. Exact simulator commands and failure names are in the companion handoff below. The legacy HTTP handler's 201/message and additive group/count are also directly tested with injected SQL.

Changed files: `helpers/validators/finishedPlan.ts`; route recovery/permit helpers; ArcGIS capability/photo provider/handlers/tests; finished-plan operations/handlers/routes/tests; flightPlans status handler; shared legacy/iOS log writer/handlers/tests. No database-schema or deployment files were touched.

Manual checklist: use generated geometry images; finish and confirm one package; inspect owner IDs/timestamps and separate stage states; lose each acknowledgment; cancel/relaunch; force journal failure; expire login; verify confirmed stages never repeat and missing log-group evidence stays pending. Restart process after preparing a permit: stale permit must not write. Do not run live writes without separate authorization.

Full iOS/shared handoff: `/Users/aboudi17/Github/LIS-iOS/LIS Mobile/ios-documnetation/implementation plan/upload-existing-records-v2-2026-10-13.md`.

Pending: actual layer metadata/content endpoint behavior, deployed existing business schema/routes, authenticated staging/website/Desktop acceptance, real PostgreSQL locking, server-process routing, office geometry-first-member and timer display. No exactly-once guarantee across independent services; evidence retention/cleanup remains owned by later steps.
