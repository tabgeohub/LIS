# Batch 5 — Connectivity, Session and Hygiene (W-07, W-10, W-11, W-13) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the four remaining findings — a connectivity gate that lies, a logout that silently does nothing offline, observation timestamps from an unsynchronised clock, and live ArcGIS tokens persisted in the database.

**Architecture:** Four independent fixes with no dependencies between them; they are batched only because each is small. Every one follows the same shape used throughout this programme: put the decision in a pure, unit-tested function, then wire it in.

**Tech Stack:** Electron 28, React 19, TypeScript 5.7, Vitest 3, `node:test`; Express 4 + Postgres + ts-node on the backend.

**Spec:** `../../lis-upload-weaknesses.html` (findings W-07, W-10, W-11, W-13)

## ⚠️ Gate — read before starting Task 2

**Batch 0 Task 4 must be complete.** If its verdict was **`NOT_REQUIRED`**, do
**not** implement Task 2 as written — use the *removal variant* documented at
the end of that task instead. The two fixes are opposites and choosing wrongly
either weakens a real security control or keeps an extra login in the workflow
for no benefit.

## Global Constraints

- **Repos:** `LIS-Desktop` and `LIS` (backend).
- **Depends on Batch 1** (Vitest) only. Independent of Batches 2, 3 and 4 — this
  batch can be done in parallel by a second person.
- **User-facing strings are Dutch.**
- Tasks 1, 3 and 4 are ungated and can start immediately.

## File Structure

| File | Responsibility |
|---|---|
| `src/helpers/connectivity.ts` *(new, Desktop)* | **Pure.** Decides online state from probe results |
| `src/helpers/connectivity.test.ts` *(new, Desktop)* | Vitest suite |
| `src/Components/Common/ConnectivityListener.tsx` *(Desktop)* | Probes before declaring online |
| `electron/login.js` *(Desktop)* | `auth:clear-session` IPC |
| `src/utils/authFlow.ts` *(Desktop)* | Clears the cookie jar; queues the revoke |
| `src/helpers/gpsTime.ts` *(new, Desktop)* | **Pure.** Prefers GPS UTC over the device clock |
| `backend/src/helpers/finished-plans/finishedAtBounds.ts` *(new)* | **Pure.** Rejects implausible timestamps |
| `backend/src/helpers/repositories/arcgisUrl.ts` *(new)* | **Pure.** Strips a token from an attachment URL |

---

### Task 1: Probe before declaring the app online (W-07)

`navigator.onLine` reports link-layer connectivity only. Airport wifi behind a
captive portal, or a hotspot with no upstream, enables the upload button and
then fails every request — and reconnecting on an unfamiliar network hours after
the flight is the normal path here, not an edge case.

**Files:**
- Create: `LIS-Desktop/src/helpers/connectivity.ts`
- Create: `LIS-Desktop/src/helpers/connectivity.test.ts`
- Modify: `LIS-Desktop/src/Components/Common/ConnectivityListener.tsx`
- Modify: `LIS-Desktop/src/helpers/zustand/useConnection.ts`

**Interfaces:**
- Consumes: `backendClient` from `@utils/backendClient`
- Produces:
  - `resolveOnlineState(input: { navigatorOnline: boolean; probe: () => Promise<boolean> }): Promise<boolean>`
  - `probeBackend(client: { get: (url: string, config?: unknown) => Promise<{ status: number }> }): Promise<boolean>`

- [ ] **Step 1: Write the failing tests**

Create `src/helpers/connectivity.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { probeBackend, resolveOnlineState } from "./connectivity";

describe("resolveOnlineState", () => {
  it("is offline immediately when the OS says the link is down", async () => {
    const probe = vi.fn();
    const online = await resolveOnlineState({
      navigatorOnline: false,
      probe,
    });
    expect(online).toBe(false);
    // No point probing a down link.
    expect(probe).not.toHaveBeenCalled();
  });

  it("is online only when the probe also succeeds", async () => {
    expect(
      await resolveOnlineState({
        navigatorOnline: true,
        probe: async () => true,
      })
    ).toBe(true);
  });

  it("is offline when the link is up but the backend is unreachable", async () => {
    expect(
      await resolveOnlineState({
        navigatorOnline: true,
        probe: async () => false,
      })
    ).toBe(false);
  });

  it("is offline when the probe throws", async () => {
    expect(
      await resolveOnlineState({
        navigatorOnline: true,
        probe: async () => {
          throw new Error("captive portal returned HTML");
        },
      })
    ).toBe(false);
  });
});

describe("probeBackend", () => {
  it("is true on a 200", async () => {
    const client = { get: async () => ({ status: 200 }) };
    expect(await probeBackend(client)).toBe(true);
  });

  it("is false on any other status", async () => {
    expect(await probeBackend({ get: async () => ({ status: 302 }) })).toBe(false);
    expect(await probeBackend({ get: async () => ({ status: 500 }) })).toBe(false);
  });

  it("is false when the request fails", async () => {
    const client = {
      get: async () => {
        throw new Error("ENOTFOUND");
      },
    };
    expect(await probeBackend(client)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd LIS-Desktop
npm test -- connectivity
```

Expected: FAIL — cannot resolve `./connectivity`.

- [ ] **Step 3: Implement it**

Create `src/helpers/connectivity.ts`:

```ts
/**
 * Connectivity that means "the LIS backend is reachable", not "a cable is
 * plugged in".
 *
 * navigator.onLine is link-layer only: a captive portal or an upstream-less
 * hotspot reports online and then fails every request (W-07). Since this
 * workflow deliberately ends offline and resumes hours later on whatever
 * network is available, that is the normal case.
 */

/** The backend answers this with "LIS Backend is running!". */
const PROBE_PATH = "/";
const PROBE_TIMEOUT_MS = 4000;

export async function probeBackend(client: {
  get: (url: string, config?: unknown) => Promise<{ status: number }>;
}): Promise<boolean> {
  try {
    const response = await client.get(PROBE_PATH, {
      timeout: PROBE_TIMEOUT_MS,
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

export async function resolveOnlineState(input: {
  navigatorOnline: boolean;
  probe: () => Promise<boolean>;
}): Promise<boolean> {
  // A down link is authoritative — skip the probe entirely.
  if (!input.navigatorOnline) return false;

  try {
    return await input.probe();
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test -- connectivity
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Wire it into the listener**

Rewrite `src/Components/Common/ConnectivityListener.tsx` so both the event
handlers and a slow interval go through the probe:

```tsx
import { useEffect } from "react";
import { useConnection } from "@helpers/zustand/useConnection";
import { probeBackend, resolveOnlineState } from "@helpers/connectivity";
import { backendClient } from "@utils/backendClient";

const RECHECK_INTERVAL_MS = 30000;

export default function ConnectivityListener() {
  const { setIsOnline, setShow, setWasOffline } = useConnection();

  useEffect(() => {
    let cancelled = false;

    const evaluate = async () => {
      const online = await resolveOnlineState({
        navigatorOnline: navigator.onLine,
        probe: () => probeBackend(backendClient),
      });

      if (cancelled) return;

      setIsOnline(online);
      if (!online) {
        setWasOffline(true);
        setShow(true);
      }
    };

    void evaluate();

    const interval = setInterval(() => void evaluate(), RECHECK_INTERVAL_MS);
    window.addEventListener("online", evaluate);
    window.addEventListener("offline", evaluate);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("online", evaluate);
      window.removeEventListener("offline", evaluate);
    };
  }, [setIsOnline, setShow, setWasOffline]);

  return null;
}
```

If the existing component renders a banner rather than returning `null`, keep
that JSX and change only the effect.

- [ ] **Step 6: Do not assume online at startup**

In `src/helpers/zustand/useConnection.ts`, change the initial state so the app
starts pessimistic until the first probe answers:

```ts
  isOnline: false,
  …
  wasOffline: true,
```

- [ ] **Step 7: Verify manually**

```bash
npm run dev
```

Disconnect the network. Expected: within 30 s the upload and select buttons
disable. Reconnect to a network with no route to the backend (e.g. a phone
hotspot with mobile data off). Expected: the buttons stay disabled even though
Windows reports a connection.

- [ ] **Step 8: Commit**

```bash
git add src/helpers/connectivity.ts src/helpers/connectivity.test.ts \
        "src/Components/Common/ConnectivityListener.tsx" \
        src/helpers/zustand/useConnection.ts
git commit -m "fix: probe the backend before declaring the app online (W-07)"
```

---

### Task 2: Make the logout actually take effect (W-10)

**Gated on Batch 0 Q4 — see the warning at the top of this file.**

At Verstuur the device is offline by definition, so `POST /auth2/logout` always
fails: the Keycloak refresh token is never revoked, and nothing clears the
Electron cookie jar, so a restart can silently restore the session.

**Files:**
- Modify: `LIS-Desktop/electron/login.js`
- Modify: `LIS-Desktop/electron/preload.cjs`
- Modify: `LIS-Desktop/src/types.ts`
- Modify: `LIS-Desktop/src/utils/authFlow.ts`
- Create: `LIS-Desktop/src/utils/pendingLogout.ts`
- Create: `LIS-Desktop/src/utils/pendingLogout.test.ts`

**Interfaces:**
- Consumes: `session.fromPartition` (Electron main)
- Produces:
  - `window.electron.clearAuthSession(): Promise<{ success: boolean }>`
  - `markLogoutPending()` / `isLogoutPending()` / `clearLogoutPending()`

- [ ] **Step 1: Write the failing tests for the pending-logout marker**

Create `src/utils/pendingLogout.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  clearLogoutPending,
  isLogoutPending,
  markLogoutPending,
  PENDING_LOGOUT_KEY,
} from "./pendingLogout";

describe("pendingLogout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is not pending by default", () => {
    expect(isLogoutPending()).toBe(false);
  });

  it("records and reports a pending logout", () => {
    markLogoutPending();
    expect(isLogoutPending()).toBe(true);
    expect(localStorage.getItem(PENDING_LOGOUT_KEY)).toBeTruthy();
  });

  it("clears the marker", () => {
    markLogoutPending();
    clearLogoutPending();
    expect(isLogoutPending()).toBe(false);
  });

  it("survives a malformed stored value", () => {
    localStorage.setItem(PENDING_LOGOUT_KEY, "not-json");
    expect(isLogoutPending()).toBe(true);
  });
});
```

This test needs a DOM `localStorage`. Add `environment: "jsdom"` for this file
by placing at the top of the test:

```ts
// @vitest-environment jsdom
```

and install the dependency:

```bash
npm install --save-dev jsdom
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- pendingLogout
```

Expected: FAIL — cannot resolve `./pendingLogout`.

- [ ] **Step 3: Implement the marker**

Create `src/utils/pendingLogout.ts`:

```ts
export const PENDING_LOGOUT_KEY = "lis_pending_logout";

/**
 * Verstuur happens offline, so the server-side revoke cannot run then. We
 * record the intent and fire it on the next successful connection, so the
 * Keycloak refresh token is revoked even though the device was offline when
 * the operator finished (W-10).
 */
export function markLogoutPending(): void {
  try {
    localStorage.setItem(PENDING_LOGOUT_KEY, String(Date.now()));
  } catch {
    // Storage unavailable — the local cookie clear still happens.
  }
}

export function isLogoutPending(): boolean {
  try {
    return localStorage.getItem(PENDING_LOGOUT_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearLogoutPending(): void {
  try {
    localStorage.removeItem(PENDING_LOGOUT_KEY);
  } catch {
    // Nothing to do.
  }
}
```

- [ ] **Step 4: Run to verify it passes**

```bash
npm test -- pendingLogout
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Add the cookie-clearing IPC**

In `LIS-Desktop/electron/login.js`, inside `registerLoginIpc()`:

```js
  // The renderer cannot clear an httpOnly cookie, so a "logout" that failed to
  // reach the server used to leave lis.sid in the jar — and a restart would
  // silently restore the session (W-10).
  ipcMain.handle("auth:clear-session", async () => {
    try {
      const authSession = session.fromPartition("persist:lis-desktop-session");
      await authSession.clearStorageData({ storages: ["cookies"] });
      return { success: true };
    } catch (error) {
      console.error("[login] Failed to clear session cookies:", error);
      return { success: false };
    }
  });
```

- [ ] **Step 6: Expose and type it**

In `electron/preload.cjs`, beside `login` and `debugBackendCookies`:

```js
  clearAuthSession: () => ipcRenderer.invoke("auth:clear-session"),
```

In `src/types.ts`, inside `Window.electron`:

```ts
      clearAuthSession?: () => Promise<{ success: boolean }>;
```

- [ ] **Step 7: Always clear locally; queue the revoke**

In `src/utils/authFlow.ts`, rewrite `logoutAuthenticatedUser`:

```ts
export async function logoutAuthenticatedUser(): Promise<{
  serverLogoutOk: boolean;
}> {
  let serverLogoutOk = false;

  try {
    const res = await fetch(`${backendBaseUrl}/auth2/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-LIS-Client": "desktop",
      },
    });

    if (res.ok) {
      await res.json().catch(() => {});
      serverLogoutOk = true;
    } else {
      const msg = await res.text().catch(() => "");
      console.warn("Server logout failed:", msg || res.status);
    }
  } catch (error) {
    console.warn("Server logout request failed:", error);
  }

  if (!serverLogoutOk) {
    // Offline at Verstuur is the normal case — revoke on the next connection.
    markLogoutPending();
  } else {
    clearLogoutPending();
  }

  // Always clear the cookie jar, regardless of the server call. This is what
  // actually forces the re-login.
  try {
    await window.electron?.clearAuthSession?.();
  } catch (error) {
    console.warn("Failed to clear the Electron cookie jar:", error);
  }

  clearAuthenticatedUser();
  resetAuthBootstrapState();
  return { serverLogoutOk };
}
```

with imports:

```ts
import { clearLogoutPending, markLogoutPending } from "./pendingLogout";
```

- [ ] **Step 8: Flush the queued revoke when connectivity returns**

In `src/App.tsx`, inside the existing bootstrap effect, before
`loadAuthenticatedUserAndStartArcgis()`:

```tsx
    if (isLogoutPending()) {
      void fetch(`${backendBaseUrl}/auth2/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-LIS-Client": "desktop",
        },
      })
        .then(() => clearLogoutPending())
        .catch(() => {
          // Still offline — try again next launch.
        });
    }
```

Import `isLogoutPending`, `clearLogoutPending` and reuse the same
`backendBaseUrl` derivation already present in `authFlow.ts` by exporting it
from there rather than duplicating the expression.

- [ ] **Step 9: Verify manually**

```bash
npm run dev
```

Log in, disconnect the network, press Verstuur. Expected: the login button
returns. Restart the app **while still offline**. Expected: still logged out
(before this change, the surviving cookie logged you straight back in).
Reconnect and restart. Expected: the queued revoke fires once and the marker
clears.

- [ ] **Step 10: Commit**

```bash
git add electron/login.js electron/preload.cjs src/types.ts \
        src/utils/authFlow.ts src/utils/pendingLogout.ts src/utils/pendingLogout.test.ts \
        src/App.tsx package.json package-lock.json
git commit -m "fix: clear the cookie jar and queue the revoke on offline logout (W-10)"
```

#### Removal variant — use only if Batch 0 Q4 returned `NOT_REQUIRED`

Skip Steps 1–8 entirely. Instead, in
`src/Components/Main/Left/Actions/OfflineAreas/Buttons/SaveButton.tsx`, delete
the block that calls `logoutAuthenticatedUser()`, `setUser({ user_id: 0, … })`
and the accompanying `logAction`, keeping everything above it. Update
`LIS-Desktop/docs/SYSTEM-DESIGN.md` (the note at ~line 269 and the tradeoff row
at ~565) to record that the forced re-login was removed and why. Commit as:

```bash
git commit -m "fix: remove the ineffective forced logout at Verstuur (W-10)"
```

---

### Task 3: Prefer GPS time for `finishedAt` and bound it server-side (W-11)

`finishedAt` is `Date.now()` on a machine that has been offline — and therefore
without time sync — for hours. A wrong device clock writes wrong observation
times that are indistinguishable from correct ones.

**Files:**
- Create: `LIS-Desktop/src/helpers/gpsTime.ts`
- Create: `LIS-Desktop/src/helpers/gpsTime.test.ts`
- Modify: `LIS-Desktop/src/Components/Main/Left/Offline/SelectedPointForm/Buttons/Submit.tsx`
- Modify: `LIS-Desktop/src/Components/Main/Left/Offline/SelectedPointForm/Buttons/Update.tsx`
- Create: `LIS/backend/src/helpers/finished-plans/finishedAtBounds.ts`
- Create: `LIS/backend/src/helpers/finished-plans/finishedAtBounds.test.ts`
- Modify: `LIS/backend/src/helpers/finished-plans/createFinishedPlanDb.ts`
- Modify: `LIS/backend/package.json`

**Interfaces:**
- Produces:
  - `resolveFinishedAt(input: { gpsUtcMs?: number | null; deviceMs: number }): number` (Desktop)
  - `boundFinishedAt(value: unknown, now?: number): Date | null` (backend)

- [ ] **Step 1: Write the desktop test**

Create `src/helpers/gpsTime.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveFinishedAt } from "./gpsTime";

describe("resolveFinishedAt", () => {
  it("prefers GPS time when it is available", () => {
    expect(resolveFinishedAt({ gpsUtcMs: 1757068790000, deviceMs: 1 })).toBe(
      1757068790000
    );
  });

  it("falls back to the device clock without a fix", () => {
    expect(resolveFinishedAt({ gpsUtcMs: null, deviceMs: 42 })).toBe(42);
    expect(resolveFinishedAt({ deviceMs: 42 })).toBe(42);
  });

  it("ignores a nonsensical GPS value", () => {
    expect(resolveFinishedAt({ gpsUtcMs: 0, deviceMs: 42 })).toBe(42);
    expect(resolveFinishedAt({ gpsUtcMs: NaN, deviceMs: 42 })).toBe(42);
    expect(resolveFinishedAt({ gpsUtcMs: -5, deviceMs: 42 })).toBe(42);
  });
});
```

- [ ] **Step 2: Run to verify it fails, then implement**

```bash
npm test -- gpsTime
```

Create `src/helpers/gpsTime.ts`:

```ts
/**
 * GPS is an authoritative UTC clock and this app already has an NMEA feed. The
 * device clock has been unsynchronised for the length of the flight (W-11).
 */
export function resolveFinishedAt(input: {
  gpsUtcMs?: number | null;
  deviceMs: number;
}): number {
  const gps = input.gpsUtcMs;
  if (typeof gps === "number" && Number.isFinite(gps) && gps > 0) {
    return gps;
  }
  return input.deviceMs;
}
```

```bash
npm test -- gpsTime
```

Expected: PASS, 3 tests.

- [ ] **Step 3: Use it at both stamp sites**

In `Submit.tsx` and `Update.tsx`, replace each `const finishedAt = Date.now();`
with:

```tsx
      const finishedAt = resolveFinishedAt({
        gpsUtcMs: helicopterState.utcMs ?? null,
        deviceMs: Date.now(),
      });
```

importing `resolveFinishedAt` from `@helpers/gpsTime` and reading
`helicopterState` from `useHelicopterState()` if it is not already in scope.

If `utcMs` is not currently parsed out of the NMEA sentences, add it in
`src/helpers/parseGPSData.ts` — GPRMC field 1 is UTC time and field 9 is the
date; combine them into an epoch. If that is more work than this batch warrants,
pass `gpsUtcMs: null` and land only the backend bound in Step 4, leaving a
`// TODO(W-11)` referencing this plan.

- [ ] **Step 4: Write the backend bound test**

Create `LIS/backend/src/helpers/finished-plans/finishedAtBounds.test.ts`:

```ts
import assert from "node:assert/strict";
import { boundFinishedAt } from "./finishedAtBounds";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

const NOW = Date.parse("2026-09-05T12:00:00Z");

run("accepts a plausible recent timestamp", () => {
  const value = NOW - 3 * 60 * 60 * 1000;
  assert.equal(boundFinishedAt(value, NOW)?.getTime(), value);
});

run("accepts an ISO string", () => {
  assert.equal(
    boundFinishedAt("2026-09-05T09:00:00Z", NOW)?.getTime(),
    Date.parse("2026-09-05T09:00:00Z")
  );
});

run("rejects a timestamp in the future", () => {
  assert.equal(boundFinishedAt(NOW + 48 * 60 * 60 * 1000, NOW), null);
});

run("rejects an implausibly old timestamp", () => {
  assert.equal(boundFinishedAt(0, NOW), null);
  assert.equal(boundFinishedAt(Date.parse("2019-01-01T00:00:00Z"), NOW), null);
});

run("rejects unparseable and empty values", () => {
  assert.equal(boundFinishedAt(null, NOW), null);
  assert.equal(boundFinishedAt(undefined, NOW), null);
  assert.equal(boundFinishedAt("not a date", NOW), null);
  assert.equal(boundFinishedAt("", NOW), null);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("finishedAtBounds tests passed");
```

Register it in `LIS/backend/package.json`:

```json
    "test:finished-at-bounds": "npx ts-node --transpile-only src/helpers/finished-plans/finishedAtBounds.test.ts",
```

- [ ] **Step 5: Implement the bound**

Create `LIS/backend/src/helpers/finished-plans/finishedAtBounds.ts`:

```ts
/** Nothing in LIS predates this; anything older is a broken device clock. */
const EARLIEST_PLAUSIBLE_MS = Date.parse("2020-01-01T00:00:00Z");

/** Allow modest clock skew forward, but not days. */
const MAX_FUTURE_SKEW_MS = 24 * 60 * 60 * 1000;

/**
 * Normalises the Desktop Opslaan timestamp and rejects implausible values.
 *
 * The stamp comes from a device that has been offline — and unsynchronised —
 * for hours (W-11). Storing a wrong time is worse than storing none, because a
 * wrong one is indistinguishable from a correct one.
 */
export function boundFinishedAt(
  value: unknown,
  now: number = Date.now()
): Date | null {
  let ms: number | null = null;

  if (typeof value === "number" && Number.isFinite(value)) {
    ms = value;
  } else if (typeof value === "string" && value.trim() !== "") {
    const parsed = Date.parse(value);
    ms = Number.isNaN(parsed) ? null : parsed;
  }

  if (ms === null) return null;
  if (ms < EARLIEST_PLAUSIBLE_MS) return null;
  if (ms > now + MAX_FUTURE_SKEW_MS) return null;

  return new Date(ms);
}
```

- [ ] **Step 6: Run the backend test**

```bash
cd LIS/backend && npm run test:finished-at-bounds
```

Expected: `finishedAtBounds tests passed`.

- [ ] **Step 7: Use it in the writer**

In `createFinishedPlanDb.ts`, delete the local `normalizeFinishedAt` function
and import the bounded version instead:

```ts
import { boundFinishedAt } from "./finishedAtBounds";
```

then in `finishedRowParams` replace `normalizeFinishedAt(point.finishedAt)` with
`boundFinishedAt(point.finishedAt)`.

- [ ] **Step 8: Verify compilation and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/helpers/finished-plans/finishedAtBounds.ts \
        src/helpers/finished-plans/finishedAtBounds.test.ts \
        src/helpers/finished-plans/createFinishedPlanDb.ts package.json
git commit -m "fix: bound finishedAt against implausible device clocks (W-11)"
```

and in LIS-Desktop:

```bash
git add src/helpers/gpsTime.ts src/helpers/gpsTime.test.ts \
        "src/Components/Main/Left/Offline/SelectedPointForm/Buttons/"
git commit -m "feature: prefer GPS UTC over the device clock for finishedAt (W-11)"
```

---

### Task 4: Stop persisting live ArcGIS tokens (W-13)

The desktop appends the current token to each attachment URL, and that full
string is stored in `lis.attachments.url` indefinitely. The web strips it before
rendering, so it is inert at display time — but the token text sits in database
rows, backups and logs, and it is the shared *application* token, not a per-user
one.

**Files:**
- Modify: `LIS-Desktop/src/.../hooks/useUploadAttachmentsForPoint.ts`
- Create: `LIS/backend/src/helpers/repositories/arcgisUrl.ts`
- Create: `LIS/backend/src/helpers/repositories/arcgisUrl.test.ts`
- Modify: `LIS/backend/src/helpers/repositories/attachmentsRepo.ts`
- Create: `LIS/backend/scripts/strip-attachment-tokens.sql`
- Modify: `LIS/backend/package.json`

**Interfaces:**
- Produces: `stripArcgisToken(url: unknown): string | null`

- [ ] **Step 1: Stop appending it client-side**

In `useUploadAttachmentsForPoint.ts`, replace the URL construction (the block
that reads `const url = \`${attachmentsLayerArcgis.url}/0/${objectId}/attachments/${attachment.id}${token ? …}\``) with:

```ts
        // No token in the persisted URL: the web fetches through
        // GET /api/arcgis/proxy, which mints a fresh server-side token. Storing
        // one here only leaks the shared app credential into the database (W-13).
        const url = `${attachmentsLayerArcgis.url}/0/${objectId}/attachments/${attachment.id}`;
```

The `const token = getArcGISToken() || initialToken || "";` line above it and its
explanatory comment become dead — delete both.

- [ ] **Step 2: Write the backend test**

Create `LIS/backend/src/helpers/repositories/arcgisUrl.test.ts`:

```ts
import assert from "node:assert/strict";
import { stripArcgisToken } from "./arcgisUrl";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

const BASE =
  "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer/0/0/118/attachments/9";

run("removes a token query parameter", () => {
  assert.equal(stripArcgisToken(`${BASE}?token=abc123`), BASE);
});

run("removes a token among other parameters", () => {
  assert.equal(stripArcgisToken(`${BASE}?f=json&token=abc123`), `${BASE}?f=json`);
  assert.equal(stripArcgisToken(`${BASE}?token=abc&f=json`), `${BASE}?f=json`);
});

run("leaves a clean url untouched", () => {
  assert.equal(stripArcgisToken(BASE), BASE);
});

run("handles a non-url string without throwing", () => {
  assert.equal(stripArcgisToken("not a url?token=abc"), "not a url");
});

run("passes through empty and non-string values", () => {
  assert.equal(stripArcgisToken(null), null);
  assert.equal(stripArcgisToken(undefined), null);
  assert.equal(stripArcgisToken(42), null);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("arcgisUrl tests passed");
```

Register it:

```json
    "test:arcgis-url": "npx ts-node --transpile-only src/helpers/repositories/arcgisUrl.test.ts",
```

- [ ] **Step 3: Implement the stripper**

Create `LIS/backend/src/helpers/repositories/arcgisUrl.ts`:

```ts
/**
 * Removes any ArcGIS token from an attachment URL before it is persisted.
 *
 * Done server-side so it holds regardless of which desktop build sent the row.
 * The URL only needs the layer, objectId and attachment id — the web fetches
 * through /api/arcgis/proxy, which supplies a fresh token.
 */
export function stripArcgisToken(url: unknown): string | null {
  if (typeof url !== "string" || url.trim() === "") return null;

  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("token");
    return parsed.toString().replace(/\?$/, "");
  } catch {
    // Not an absolute URL — fall back to a textual strip.
    return url.replace(/[?&]token=[^&]*/g, "").replace(/[?&]$/, "");
  }
}
```

- [ ] **Step 4: Run the test**

```bash
cd LIS/backend && npm run test:arcgis-url
```

Expected: `arcgisUrl tests passed`.

- [ ] **Step 5: Apply it on insert**

In `attachmentsRepo.ts`, change `attachmentInsertParams`:

```ts
function attachmentInsertParams(input: AttachmentInsertInput) {
  return [
    stripArcgisToken(input.url),
    input.pointId,
    input.attachmentId,
    input.taken_at,
    input.location,
  ];
}
```

with the import:

```ts
import { stripArcgisToken } from "./arcgisUrl";
```

- [ ] **Step 6: Clean historic rows**

Create `LIS/backend/scripts/strip-attachment-tokens.sql`:

```sql
-- Run manually against the LIS Postgres database.
-- Removes ArcGIS tokens persisted in attachment URLs by older desktop builds.
-- The web already strips the token before rendering, so this changes nothing
-- functionally — it only stops the shared app credential sitting in rows,
-- backups and logs.

-- Preview first:
-- SELECT COUNT(*) FROM lis.attachments WHERE url LIKE '%token=%';

UPDATE lis.attachments
SET url = regexp_replace(
            regexp_replace(url, '[?&]token=[^&]*', '', 'g'),
            '[?&]$', ''
          )
WHERE url LIKE '%token=%';
```

- [ ] **Step 7: Verify end to end**

Apply the script, then upload a plan with a photo from a build containing
Step 1 and confirm:

```sql
SELECT url FROM lis.attachments ORDER BY id DESC LIMIT 5;
SELECT COUNT(*) FROM lis.attachments WHERE url LIKE '%token=%';
```

Expected: no `token=` in the new rows, and a count of `0`. Open the finished
plan on the website and confirm the images still render — the proxy supplies the
token.

- [ ] **Step 8: Commit**

```bash
git add src/helpers/repositories/arcgisUrl.ts src/helpers/repositories/arcgisUrl.test.ts \
        src/helpers/repositories/attachmentsRepo.ts \
        scripts/strip-attachment-tokens.sql package.json
git commit -m "fix: stop persisting ArcGIS tokens in attachment URLs (W-13)"
```

and in LIS-Desktop:

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useUploadAttachmentsForPoint.ts"
git commit -m "fix: do not append the ArcGIS token to stored attachment URLs (W-13)"
```

---

## Done when

- [ ] Connecting to a network with no route to the backend leaves the upload button disabled
- [ ] A Verstuur performed offline leaves the operator logged out across an app restart
- [ ] The queued revoke fires on the next connected launch and clears its marker
- [ ] `finishedAt` uses GPS UTC when a fix is available, and the backend rejects implausible values
- [ ] `SELECT COUNT(*) FROM lis.attachments WHERE url LIKE '%token=%'` returns `0`, and images still render on the website
- [ ] All suites pass: `npm test` + `npm run test:electron` (Desktop); `test:upload-id`, `test:finished-at-bounds`, `test:arcgis-url` (backend)
- [ ] `npx tsc -b --noEmit` (Desktop) and `npx tsc --noEmit` (backend) are clean
