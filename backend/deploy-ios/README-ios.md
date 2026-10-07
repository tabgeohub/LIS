# Step 05 iOS bootstrap deployment and rollback

Acceptance target: **http://acc-lis.rws.nl/backend/**. Native probe public URL:
`http://acc-lis.rws.nl/backend/api/ios/bootstrap/probe`.

Status: implemented/mounted and tested locally; **planned at acceptance, not deployed or verified**.
`/auth2-ios/*` and native business routes are planned for later owners, not mounted here.

## Scope and boundaries

Separate entry `src/server-ios.ts`, compiled to `dist-ios/server-ios.js`. Baseline
`server.ts`, `app.ts`, middleware, registration, package scripts/lock, Dockerfile and
nginx.conf are untouched. Website/Desktop continue on the baseline process/proxy.
The native process mounts only the public bootstrap probe. It does not duplicate
legacy routes or mount Swagger/ArcGIS. Route handlers and session middleware must
be added by their later owners through the new iOS modules before terminal 404/error
middleware. Step 06 must await session-store initialization before its routers and
before listening, choose/test cookie name/Path/domain/Secure and store prefix/TTL,
and implement resource cleanup without editing baseline middleware. Do not assume
this probe's readiness establishes authentication readiness.

No PostgreSQL pool, Redis/session store, Keycloak/OIDC discovery, ArcGIS request,
schema migration, receipt/deduplication table or local-data volume is opened by the
Step 05 process. No `lis.sid` cookie is read, changed, emitted or destroyed. Shared
PostgreSQL/ArcGIS effects and durable receipts must be tested when feature steps
actually introduce them. Never run the baseline service against real configuration
as a smoke-test substitute without approved environment access.

Middleware order: disable Express fingerprint/trust of forwarded IP → no-store and
nosniff headers → unchanged baseline CORS helper → bounded 16 KB JSON/form parsing
(100 form parameters) → public probe → JSON 404 → sanitized JSON errors.
CORS retains the existing allowed-origin behavior, including credentialed headers;
it is not authentication. No new origin/header allowlist is introduced.

Probe contract: GET (Express also supports HEAD) `/api/ios/bootstrap/probe`, no body,
no identity/session required. HTTP 200 JSON:

```json
{"service":"lis-ios-bootstrap","version":1,"status":"ready","scope":"bootstrap-only"}
```

Version 1 describes this bootstrap response only. Probe means listener/registry
ready, not data/service readiness. Errors: JSON `{ "error": "<code>", "version": 1 }`;
400 `invalid_request`, 413 `request_too_large`, 415 `unsupported_encoding`,
404 `not_found`, 500 `internal_error`. No environment values, stack traces, request
body, host credentials or paths are returned/logged. OPTIONS uses the reused CORS
middleware. POST/other unsupported methods have no probe handler.

## Build and local checks

From `LIS/backend`, with locked dependencies installed in an isolated checkout:

```sh
PUPPETEER_SKIP_DOWNLOAD=true npm ci --ignore-scripts --no-audit --no-fund
./node_modules/.bin/tsc -p tsconfig-ios.json
./node_modules/.bin/tsc -p tsconfig-test-ios.json
node --test dist-test-ios/bootstrap-ios.test.js
IOS_HOST=127.0.0.1 IOS_PORT=5001 node dist-ios/server-ios.js
curl --fail http://127.0.0.1:5001/api/ios/bootstrap/probe
```

Baseline `npm start` still uses `dist/server.js`. Separate output avoids replacing
baseline build artifacts. No baseline `.env` is loaded implicitly. The probe needs
no secrets. Optional `IOS_ENV_FILE=/absolute/operator/owned/path` explicitly loads a
file with dotenv; existing process environment wins, and an unreadable file aborts
startup with a sanitized error. Do not point it at baseline secrets. Example file
contains only nonsecret native configuration. CORS origins should be provided in
the process environment before module loading, using the existing baseline names.

`IOS_HOST` defaults to loopback; permitted values are `127.0.0.1`, `::1`, or explicit
`0.0.0.0` for a container. `IOS_PORT` defaults to 5001 and accepts integer 1024–65535.
`IOS_PUBLIC_BASE_URL` defaults to the supplied acceptance URL; validation requires
HTTP(S), `/backend/`, and no credentials/query/fragment. This value is configuration,
not a reachability claim. `composeBackendUrlIos` accepts relative route segments
and rejects leading slash, traversal and absolute URLs so `/backend/` is retained.

HTTP deadlines: headers 10 s, request 30 s, idle keepalive 5 s. SIGINT/SIGTERM drain
accepted requests with a 10 s deadline; forced connection closure sets exit code 1.
Startup/config/listen failures exit nonzero without dumping exceptions. Later
resource owners must close DB/Redis clients on both startup failure and shutdown.

## Concrete proposed acceptance changes — approval required, not executed

1. Build a new immutable-tagged image with `dockerfile-ios`, using its specific
   `.dockerignore` to exclude `.env`, dependencies/build outputs and local data.
   It uses Node 24, runs as user `node`, copies only iOS compiled output at runtime,
   and has a probe health check. Image build/runtime are **unverified here**: Docker
   is unavailable. Node 24.19.0 was used for local tests. Baseline image stays intact.
2. Start a separate Compose project `lis-ios-bootstrap`, service `ios-bootstrap`,
   published only on **host loopback 127.0.0.1:5001**. There are no volumes, external
   secrets, database dependencies or baseline service changes. Filesystem is read
   only, capabilities dropped, no privilege escalation; grace period 15 s.
3. Add only the exact location in `nginx-probe-ios.conf.example` to the **actual**
   acceptance server block after recording/backing up that config. It maps public
   `/backend/api/ios/bootstrap/probe` to the loopback process's
   `/api/ios/bootstrap/probe`. Existing `/backend/` routing, auth, web/Desktop
   listeners and all other routes must remain unchanged. No wildcard native proxy
   is proposed. Do not install the example as a replacement server block.
4. Validate proxy config and reload after approval. Verify exact public probe DTO,
   baseline root/protected-route guards, redirect/transport, and original workflows
   using authorized disposable accounts/data. Record revision/image digest, host,
   config backup path, operator, commands/time, checks and rollback evidence.

Proposed commands from the approved immutable backend checkout (NOT run remotely):

```sh
export IOS_IMAGE_TAG="$(git rev-parse HEAD)"
docker compose -f deploy-ios/compose-ios.yaml build ios-bootstrap
docker compose -f deploy-ios/compose-ios.yaml up -d ios-bootstrap
curl --fail http://127.0.0.1:5001/api/ios/bootstrap/probe
# Operator: backup the real proxy server-block file; add the reviewed exact location.
sudo nginx -t
sudo nginx -s reload
curl --noproxy '*' --fail --max-time 15 \
  http://acc-lis.rws.nl/backend/api/ios/bootstrap/probe
```

Deploy only a revision containing these new files; current uncommitted work cannot
be identified by HEAD alone. Confirm the current proxy actually runs on the same
host as Compose. If it is containerized/on another host, the loopback upstream is
wrong: record and review a new network/upstream artifact before activation. Do not
open 5001 publicly. A Docker port conflict must fail without displacing another
listener. Remote hosting, service ownership, account permissions, baseline image
revision, proxy file/server-block/namespace and port availability are **unknown**.
No live configuration change is authorized by this runbook; obtain explicit user
approval for the resolved host/config changes first. Any unavoidable baseline file
or deployment config modification requires the user's explicit exception.

The supplied URL is HTTP. No HTTPS redirect/canonical transport, VPN/DNS access or
cookie scope has been observed. Step 07 must not infer ATS exceptions or globally
disable ATS from this probe. Step 06 owns cookie/session verification; this step
cannot demonstrate Secure cookies on the supplied HTTP target.

## Rollback — preserve committed data and receipts

1. Withdraw only the added exact probe location (or restore the recorded proxy
   backup after confirming it contains no later unrelated change). `nginx -t`, then
   reload; verify original `/backend/` root and protected-route contracts still work.
2. Stop only the standalone native project:

```sh
docker compose -f deploy-ios/compose-ios.yaml stop ios-bootstrap
```

3. Retain image/revision, config backup and sanitized evidence for later restart.
   Do not stop/restart the baseline project, delete volumes, flush sessions/Redis,
   reverse migrations, delete committed PostgreSQL/ArcGIS results, purge operation
   keys/receipts or clear client journals. No data rollback command is part of this
   step. Stop leaves native probe unavailable while baseline routes continue.
4. To restore this probe, restart its immutable image and reapply only its reviewed
   exact proxy location after approval. Repeat health/legacy checks.

Step 05 has no durable write API or receipt schema. Local stop/restart proves
unchanged disposable marker-file bytes and continuing legacy guards only. Real
staging committed-data/receipt preservation and retry-after-rollback checks are
**blocked/not run**, not passed. Feature owners must retain additive compatible
schema and durable keys/readback even when withdrawing a writer. Never reroute an
uncertain iOS operation to a legacy endpoint that lacks deduplication, or treat a
retained receipt as a fresh send. Compatibility evidence must precede such routing.

## Evidence

See the owning LIS-iOS Step 05 handoff and DECISIONS S05 for exact results, source
fingerprints and blockers. No remote activation, stop/restart, rollback, schema or
session operation was performed. Public read-only DNS probing did not reach HTTP.
