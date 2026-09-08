# Batch 4 — Upload Resilience (W-04, W-06, W-03) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make an interrupted upload resumable instead of destructive — so a dropped connection hours after the flight costs a retry, not a duplicate flight in the database and a pile of orphaned ArcGIS features.

**Architecture:** Three related fixes, ordered so each makes the next safer. First the desktop checkpoints attachment results into `flightPlan.json` as they succeed, so a retry skips work already done (W-04). Then a keep-alive holds the backend session open through the long ArcGIS phase, which today makes no backend calls at all (W-06). Finally an `upload_id` generated once at Verstuur and enforced unique server-side turns a replayed POST into a no-op instead of a second copy of the flight (W-03).

**Tech Stack:** Electron 28, React 19, TypeScript 5.7, Vitest 3, `node:test`; Express 4 + Postgres (`pg`) + ts-node on the backend.

**Spec:** `../../lis-upload-weaknesses.html` (findings W-03, W-04, W-06) and `./SPEC-plan-json-schema.md`

## ⚠️ Gate — read before starting Task 4

**Batch 0 Task 1 must be complete.** If its verdict was **`CONSTRAINT_EXISTS`**, a
unique index already prevents duplicate rows, so a retry raises a constraint
violation rather than corrupting data. In that case **replace Task 4** with:
catch the violation in `createFinishedPlan`, return `200` with the existing
`planId`, and skip the migration entirely. Tasks 1–3, 5 and 6 are unaffected.

The rest of this plan assumes the verdict was **`NO_CONSTRAINT`**.

## Global Constraints

- **Repos:** `LIS-Desktop` **and** `LIS` (backend). The backend half is
  backward-compatible and may ship first; the desktop half activates it.
- **Depends on Batch 1** (Vitest) and **Batch 3** (schema v2 — `attachments` and
  `uploadId` are v2 fields).
- **`uploadId` is generated at Verstuur, not at upload.** Generating it per
  attempt would defeat the entire replay check. See `SPEC-plan-json-schema.md`.
- **The migration is manual**, following the existing convention of
  `backend/scripts/add-finished-plans-finished-at.sql`. It is additive and
  idempotent; run it before deploying the backend change.
- **Backend must stay compatible with old desktop builds** that send no
  `uploadId` — the column is nullable and the replay check is skipped when it is
  absent.

## File Structure

| File | Responsibility |
|---|---|
| `src/.../hooks/uploadCheckpoint.ts` *(new, Desktop)* | **Pure.** Decides which points still need uploading and merges results into the plan |
| `src/.../hooks/uploadCheckpoint.test.ts` *(new, Desktop)* | Vitest suite |
| `src/.../hooks/useProcessPlan.ts` *(Desktop)* | Skips completed points; checkpoints after each; runs the keep-alive |
| `src/.../hooks/useSavFinishedPoints.ts` *(Desktop)* | Ensures a stable `uploadId` and sends it |
| `backend/scripts/add-finished-plans-upload-id.sql` *(new)* | Additive migration |
| `backend/src/helpers/repositories/finishedPlansRepo.ts` | Carries `upload_id`; adds the replay lookup |
| `backend/src/helpers/finished-plans/createFinishedPlanDb.ts` | Replay check at the top of `save()` |
| `backend/src/helpers/validators/finishedPlan.ts` | Accepts and validates `uploadId` |
| `backend/src/helpers/validators/uploadId.ts` *(new)* | **Pure.** UUID validation |
| `backend/src/helpers/validators/uploadId.test.ts` *(new)* | ts-node suite |

`src/.../hooks/` is shorthand for
`LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/`.

---

### Task 1: Write the pure checkpoint module

**Files:**
- Create: `LIS-Desktop/src/.../hooks/uploadCheckpoint.ts`
- Create: `LIS-Desktop/src/.../hooks/uploadCheckpoint.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type CheckpointPoint = { id: number; images?: unknown[] | null; attachments?: { url: string; objectId: number; attachmentId: number; taken_at: number }[] | null }`
  - `needsUpload(point: CheckpointPoint): boolean`
  - `pointsNeedingUpload(points: CheckpointPoint[]): CheckpointPoint[]`
  - `mergeAttachments(points, pointId, attachments): CheckpointPoint[]`

- [ ] **Step 1: Write the failing tests**

Create `.../hooks/uploadCheckpoint.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  mergeAttachments,
  needsUpload,
  pointsNeedingUpload,
  type CheckpointPoint,
} from "./uploadCheckpoint";

const attachment = {
  url: "https://arcgis/1",
  objectId: 5,
  attachmentId: 9,
  taken_at: 1757068790000,
};

describe("needsUpload", () => {
  it("is true for a point with photos and no attachments", () => {
    expect(needsUpload({ id: 1, images: [{}] })).toBe(true);
    expect(needsUpload({ id: 1, images: [{}], attachments: [] })).toBe(true);
    expect(needsUpload({ id: 1, images: [{}], attachments: null })).toBe(true);
  });

  it("is false once the point already has attachments", () => {
    expect(needsUpload({ id: 1, images: [{}], attachments: [attachment] })).toBe(
      false
    );
  });

  it("is false for a point with no photos at all", () => {
    expect(needsUpload({ id: 1, images: [] })).toBe(false);
    expect(needsUpload({ id: 1 })).toBe(false);
  });
});

describe("pointsNeedingUpload", () => {
  it("returns only the unfinished points, in order", () => {
    const points: CheckpointPoint[] = [
      { id: 1, images: [{}], attachments: [attachment] },
      { id: 2, images: [{}] },
      { id: 3, images: [] },
      { id: 4, images: [{}, {}] },
    ];
    expect(pointsNeedingUpload(points).map((p) => p.id)).toEqual([2, 4]);
  });

  it("tolerates a null point list", () => {
    expect(pointsNeedingUpload(null as unknown as CheckpointPoint[])).toEqual([]);
  });
});

describe("mergeAttachments", () => {
  it("attaches results to the matching point only", () => {
    const points: CheckpointPoint[] = [
      { id: 1, images: [{}] },
      { id: 2, images: [{}] },
    ];
    const merged = mergeAttachments(points, 2, [attachment]);

    expect(merged[0].attachments).toBeUndefined();
    expect(merged[1].attachments).toEqual([attachment]);
  });

  it("does not mutate the input array or its points", () => {
    const points: CheckpointPoint[] = [{ id: 1, images: [{}] }];
    const merged = mergeAttachments(points, 1, [attachment]);

    expect(points[0].attachments).toBeUndefined();
    expect(merged).not.toBe(points);
    expect(merged[0]).not.toBe(points[0]);
  });

  it("replaces rather than appends when called twice for a point", () => {
    const points: CheckpointPoint[] = [{ id: 1, images: [{}] }];
    const once = mergeAttachments(points, 1, [attachment]);
    const twice = mergeAttachments(once, 1, [attachment]);

    expect(twice[0].attachments).toHaveLength(1);
  });

  it("returns the list unchanged for an unknown point id", () => {
    const points: CheckpointPoint[] = [{ id: 1, images: [{}] }];
    expect(mergeAttachments(points, 99, [attachment])[0].attachments).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd LIS-Desktop
npm test -- uploadCheckpoint
```

Expected: FAIL — cannot resolve `./uploadCheckpoint`.

- [ ] **Step 3: Implement it**

Create `.../hooks/uploadCheckpoint.ts`:

```ts
/**
 * Pure upload checkpointing.
 *
 * Attachment results used to live only in a local Map for the duration of one
 * upload attempt, so any retry re-uploaded every photo and abandoned the
 * features created by the failed attempt (W-04). Persisting them into the plan
 * JSON makes an interrupted upload resumable — which matters most in exactly
 * the conditions this workflow ends in: a slow, unreliable network hours after
 * the flight.
 */

export type CheckpointAttachment = {
  url: string;
  objectId: number;
  attachmentId: number;
  taken_at: number;
};

export type CheckpointPoint = {
  id: number;
  images?: unknown[] | null;
  attachments?: CheckpointAttachment[] | null;
};

/** A point needs uploading if it has photos and no attachments recorded yet. */
export function needsUpload(point: CheckpointPoint): boolean {
  const imageCount = point?.images?.length ?? 0;
  if (imageCount === 0) return false;

  const attachmentCount = point?.attachments?.length ?? 0;
  return attachmentCount === 0;
}

export function pointsNeedingUpload(
  points: CheckpointPoint[]
): CheckpointPoint[] {
  return (points ?? []).filter(needsUpload);
}

/**
 * Returns a new point list with `attachments` set on one point. Immutable so
 * the caller can hand the result straight to setState and to the disk write
 * without aliasing surprises.
 */
export function mergeAttachments(
  points: CheckpointPoint[],
  pointId: number,
  attachments: CheckpointAttachment[]
): CheckpointPoint[] {
  return (points ?? []).map((point) =>
    point.id === pointId ? { ...point, attachments: [...attachments] } : point
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test -- uploadCheckpoint
```

Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadCheckpoint.ts" \
        "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadCheckpoint.test.ts"
git commit -m "feature: pure upload checkpoint helpers"
```

---

### Task 2: Skip completed points and checkpoint after each

**Files:**
- Modify: `LIS-Desktop/src/.../hooks/useProcessPlan.ts`

**Interfaces:**
- Consumes: `needsUpload`, `mergeAttachments` (Task 1); `window.electron.saveCurrentPlan`
- Produces: `processPlan` writes `attachments` into `flightPlan.json` after each point

- [ ] **Step 1: Import the helpers**

```ts
import { mergeAttachments, needsUpload } from "./uploadCheckpoint";
```

- [ ] **Step 2: Track the working point list**

Immediately before the `for (const [i, point] of plan.points.entries())` loop:

```ts
      // Working copy that accumulates attachments as they land, so an
      // interrupted upload can resume instead of starting over.
      let checkpointPoints = [...(plan.points ?? [])];
```

- [ ] **Step 3: Skip points already uploaded**

As the first statement inside the loop body:

```ts
        if (!needsUpload(point)) {
          // Either no photos, or its attachments are already in ArcGIS from a
          // previous attempt.
          attachmentsByPointId.set(point.id, point.attachments ?? []);
          continue;
        }
```

- [ ] **Step 4: Persist after each successful point**

Inside the `try`, immediately after `attachmentsByPointId.set(point.id, attachments);`:

```ts
            checkpointPoints = mergeAttachments(
              checkpointPoints,
              point.id,
              attachments
            );

            try {
              await window.electron?.saveCurrentPlan?.({
                ...plan,
                points: checkpointPoints,
              });
            } catch (checkpointError) {
              // A failed checkpoint costs a re-upload of this point on retry;
              // it must not abort an upload that is otherwise succeeding.
              console.error("Failed to checkpoint attachments:", checkpointError);
            }
```

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 6: Verify resumption manually**

```bash
npm run dev
```

Upload a plan with photos on three points. Kill the app (Task Manager) partway through the ArcGIS phase. Inspect the plan JSON:

```powershell
Get-Content "C:\lis-temp-data\<vluchtnummer>\flightPlan.json" | Select-String "attachments"
```

Expected: the points processed before the kill carry `attachments`. Reopen the app and upload again — expected: it visibly skips those points and only uploads the remainder.

- [ ] **Step 7: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useProcessPlan.ts"
git commit -m "fix: checkpoint attachments and skip completed points on retry (W-04)"
```

---

### Task 3: Keep the session alive through the ArcGIS phase

Between `GET /api/arcgis/token` and the final POST the app makes **no** backend
calls, so nothing refreshes the Keycloak tokens and nothing slides the rolling
cookie. On a large flight over a slow link the POST can 401 after every photo
has already been uploaded.

**Files:**
- Modify: `LIS-Desktop/src/.../hooks/useProcessPlan.ts`

**Interfaces:**
- Consumes: `getAuthMeStatus` from `@utils/backendClient`
- Produces: a 4-minute keep-alive that runs only while the upload lock is held

- [ ] **Step 1: Import it**

```ts
import { getAuthMeStatus } from "@utils/backendClient";
```

- [ ] **Step 2: Start it with the lock**

Replace the existing `setUploadAuthLock(true);` line with:

```ts
      setUploadAuthLock(true);

      // The ArcGIS phase makes no backend calls, so without this the session
      // can expire mid-upload and the final POST 401s after every photo has
      // already been uploaded (W-06). Each call runs ensureFreshSession
      // server-side and slides the rolling cookie.
      const keepAlive = setInterval(() => {
        void getAuthMeStatus();
      }, 4 * 60 * 1000);
```

- [ ] **Step 3: Stop it with the lock**

In the `finally` block, alongside `setUploadAuthLock(false);`:

```ts
      clearInterval(keepAlive);
      setUploadAuthLock(false);
```

`keepAlive` must be declared in a scope the `finally` can see — if the current
structure puts `setUploadAuthLock(true)` inside the `try`, declare
`let keepAlive: ReturnType<typeof setInterval> | undefined;` before the `try` and
assign it inside, then guard the clear with `if (keepAlive) clearInterval(keepAlive);`.

- [ ] **Step 4: Verify it compiles and the interval is always cleared**

```bash
npx tsc -b --noEmit
```

Read the function and confirm every exit path — success, thrown error, and the
`UploadBlockedError` from Batch 1 — passes through the `finally`.

- [ ] **Step 5: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useProcessPlan.ts"
git commit -m "fix: keep the backend session alive during the ArcGIS phase (W-06)"
```

---

### Task 4: Make the backend reject replays

**Repo: `LIS`.** Gated on Batch 0 Q1 — see the warning at the top of this file.

**Files:**
- Create: `LIS/backend/scripts/add-finished-plans-upload-id.sql`
- Create: `LIS/backend/src/helpers/validators/uploadId.ts`
- Create: `LIS/backend/src/helpers/validators/uploadId.test.ts`
- Modify: `LIS/backend/src/helpers/validators/finishedPlan.ts`
- Modify: `LIS/backend/src/helpers/repositories/finishedPlansRepo.ts`
- Modify: `LIS/backend/src/helpers/finished-plans/createFinishedPlanDb.ts`
- Modify: `LIS/backend/package.json`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `isValidUploadId(value: unknown): value is string`
  - `selectFinishedPlanByUploadId(db, uploadId): Promise<QueryResult>`
  - `IncomingPlan.uploadId?: string | null`

- [ ] **Step 1: Write the migration**

Create `LIS/backend/scripts/add-finished-plans-upload-id.sql`:

```sql
-- Run manually against the LIS Postgres database.
-- Makes a replayed upload a no-op instead of a second copy of the flight.
--
-- Additive and idempotent. Existing rows keep upload_id NULL; the partial
-- index ignores them so historic data needs no backfill.

ALTER TABLE lis.finished_plans
  ADD COLUMN IF NOT EXISTS upload_id UUID NULL;

CREATE UNIQUE INDEX IF NOT EXISTS finished_plans_upload_point_uniq
  ON lis.finished_plans (upload_id, point_id)
  WHERE upload_id IS NOT NULL;
```

- [ ] **Step 2: Write the failing validator tests**

Create `LIS/backend/src/helpers/validators/uploadId.test.ts`, following the
existing `safeReturnPath.test.ts` pattern:

```ts
import assert from "node:assert/strict";
import { isValidUploadId } from "./uploadId";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

run("accepts a canonical v4 uuid", () => {
  assert.equal(isValidUploadId("6f9619ff-8b86-d011-b42d-00c04fc964ff"), true);
  assert.equal(isValidUploadId("00000000-0000-4000-8000-000000000000"), true);
});

run("accepts uppercase", () => {
  assert.equal(isValidUploadId("6F9619FF-8B86-D011-B42D-00C04FC964FF"), true);
});

run("rejects malformed values", () => {
  assert.equal(isValidUploadId("not-a-uuid"), false);
  assert.equal(isValidUploadId("6f9619ff8b86d011b42d00c04fc964ff"), false);
  assert.equal(isValidUploadId("6f9619ff-8b86-d011-b42d"), false);
  assert.equal(isValidUploadId(""), false);
});

run("rejects non-strings", () => {
  assert.equal(isValidUploadId(null), false);
  assert.equal(isValidUploadId(undefined), false);
  assert.equal(isValidUploadId(42), false);
  assert.equal(isValidUploadId({}), false);
});

run("rejects a value with SQL-ish padding", () => {
  assert.equal(
    isValidUploadId("6f9619ff-8b86-d011-b42d-00c04fc964ff; DROP TABLE"),
    false
  );
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("uploadId tests passed");
```

- [ ] **Step 3: Register the test script and run it to see it fail**

In `LIS/backend/package.json`, add to `scripts`:

```json
    "test:upload-id": "npx ts-node --transpile-only src/helpers/validators/uploadId.test.ts",
```

```bash
cd LIS/backend
npm run test:upload-id
```

Expected: FAIL — cannot find `./uploadId`.

- [ ] **Step 4: Implement the validator**

Create `LIS/backend/src/helpers/validators/uploadId.ts`:

```ts
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The desktop generates this once at Verstuur and reuses it across every retry,
 * which is what lets the server recognise a replayed upload. Validated strictly
 * because it reaches a UUID column.
 */
export function isValidUploadId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npm run test:upload-id
```

Expected: `uploadId tests passed`.

- [ ] **Step 6: Accept `uploadId` in the request contract**

In `LIS/backend/src/helpers/validators/finishedPlan.ts`, add to `IncomingPlan`:

```ts
  /** Stable across retries; absent for older desktop builds. */
  uploadId?: string | null;
```

and in `validatePlanShell`, after the existing `points` check:

```ts
  if (
    plan.uploadId !== undefined &&
    plan.uploadId !== null &&
    !isValidUploadId(plan.uploadId)
  ) {
    return fail("`plan.uploadId` must be a UUID when present.");
  }
```

with the import:

```ts
import { isValidUploadId } from "./uploadId";
```

- [ ] **Step 7: Add the replay lookup and carry the column**

In `LIS/backend/src/helpers/repositories/finishedPlansRepo.ts`, add:

```ts
export async function selectFinishedPlanByUploadId(
  db: Queryable,
  uploadId: string
) {
  return db.query<{ plan_id: number }>(
    `SELECT plan_id FROM lis.finished_plans WHERE upload_id = $1 LIMIT 1`,
    [uploadId]
  );
}
```

and extend the insert:

```ts
export async function insertFinishedPlanRow(
  db: Queryable,
  values: unknown[]
) {
  return db.query(
    `INSERT INTO lis.finished_plans (point_id, plan_id, point_order, attachments_id, pointComment, status, spoed, emailadres, finished_at, upload_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    values
  );
}
```

- [ ] **Step 8: Add the replay check and pass the value**

In `LIS/backend/src/helpers/finished-plans/createFinishedPlanDb.ts`:

Import the lookup:

```ts
import {
  insertFinishedPlanRow,
  selectFinishedPlanByUploadId,
  selectMaxPointOrderForPlan,
} from "../repositories/finishedPlansRepo";
```

Add the guard as the first statement of `FinishedPlanWriter.save()`:

```ts
  async save(): Promise<void> {
    // A dropped response after a successful commit used to make the operator
    // retry, producing a second copy of the whole flight (W-03). Recognise the
    // replay and do nothing.
    if (this.plan.uploadId) {
      const existing = await selectFinishedPlanByUploadId(
        this.client,
        this.plan.uploadId
      );
      if ((existing.rowCount ?? 0) > 0) {
        this.replayed = true;
        return;
      }
    }

    await this.upsertPoints();
    await this.markFlightPlanFinished();
    await this.insertPath();
    await this.insertAttachments();
    await this.insertFinishedRows();
  }
```

Add the field next to the other private members:

```ts
  private replayed = false;

  wasReplayed(): boolean {
    return this.replayed;
  }
```

Append `upload_id` to the insert parameters in `finishedRowParams`:

```ts
      normalizeFinishedAt(point.finishedAt),
      this.plan.uploadId ?? null,
    ];
```

and return the flag from the module function:

```ts
export async function saveFinishedPlanInTransaction(
  client: PoolClient,
  plan: IncomingPlan
): Promise<{ replayed: boolean }> {
  const writer = new FinishedPlanWriter(client, plan);
  await writer.save();
  return { replayed: writer.wasReplayed() };
}
```

- [ ] **Step 9: Report the replay to the client**

In `LIS/backend/src/routes/finished_plans/createFinishedPlanHelpers.ts`, update
`saveFinishedPlanWithClient`:

```ts
    await client.query("BEGIN");
    const { replayed } = await saveFinishedPlanInTransaction(client, plan);
    await client.query("COMMIT");
    finishedPlanOk({
      res,
      data: {
        message: replayed
          ? "Vluchtplan was al opgeslagen"
          : "Vluchtplan succesvol opgeslagen",
        planId: plan.id,
        replayed,
      },
    });
```

- [ ] **Step 10: Apply the migration and verify compilation**

```bash
psql "$DATABASE_URL" -f scripts/add-finished-plans-upload-id.sql
npx tsc --noEmit
```

Expected: migration reports `ALTER TABLE` / `CREATE INDEX`, and no TypeScript errors.

- [ ] **Step 11: Commit**

```bash
git add scripts/add-finished-plans-upload-id.sql \
        src/helpers/validators/uploadId.ts src/helpers/validators/uploadId.test.ts \
        src/helpers/validators/finishedPlan.ts \
        src/helpers/repositories/finishedPlansRepo.ts \
        src/helpers/finished-plans/createFinishedPlanDb.ts \
        src/routes/finished_plans/createFinishedPlanHelpers.ts \
        package.json
git commit -m "feature: make finished plan uploads idempotent via upload_id (W-03)"
```

---

### Task 5: Generate and send a stable `uploadId`

**Repo: `LIS-Desktop`.**

**Files:**
- Modify: `LIS-Desktop/src/Components/Main/Left/Actions/OfflineAreas/Buttons/SaveButton.tsx`
- Modify: `LIS-Desktop/src/.../hooks/useSavFinishedPoints.ts`
- Modify: `LIS-Desktop/src/types.ts`

**Interfaces:**
- Consumes: `uuid` (already a dependency: `"uuid": "^11.1.0"`)
- Produces: `FlightPlanType.uploadId?: string`, sent inside the POST body

- [ ] **Step 1: Declare the field**

In `src/types.ts`, add to `FlightPlanType`:

```ts
  /**
   * Generated once at Verstuur and reused across every upload retry, so the
   * backend can recognise a replayed POST. Never regenerate it per attempt.
   */
  uploadId?: string;
```

- [ ] **Step 2: Generate it at Verstuur**

In `SaveButton.tsx`, add the import:

```tsx
import { v4 as uuidv4 } from "uuid";
```

and change the `updatedPlan` construction:

```tsx
    const updatedPlan: FlightPlanType = {
      ...selectedPlan,
      done: true,
      // Reuse an existing id if Verstuur is pressed twice for the same flight.
      uploadId: selectedPlan.uploadId ?? uuidv4(),
    };
```

- [ ] **Step 3: Send it, with a fallback for plans saved before this build**

In `useSavFinishedPoints.ts`, replace the `saveFlightPlan` call:

```ts
        // A plan saved by an older build has no uploadId; mint one now and
        // persist it so a retry of THIS upload reuses the same value.
        let uploadId = selectedPlan.uploadId;
        if (!uploadId) {
          uploadId = uuidv4();
          try {
            await window.electron?.saveCurrentPlan?.({
              ...selectedPlan,
              uploadId,
            });
          } catch (error) {
            console.error("Failed to persist uploadId:", error);
          }
        }

        const createdId = await saveFlightPlan({
          plan: { ...formattedPlan, pathData: res?.data, uploadId },
        });
```

with the import:

```ts
import { v4 as uuidv4 } from "uuid";
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts \
        "src/Components/Main/Left/Actions/OfflineAreas/Buttons/SaveButton.tsx" \
        "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useSavFinishedPoints.ts"
git commit -m "feature: send a stable uploadId so retries are idempotent"
```

---

### Task 6: Prove a replay is harmless

**Files:** none modified (verification only).

- [ ] **Step 1: Record the baseline**

```sql
SELECT COUNT(*) FROM lis.finished_plans WHERE plan_id = <planId>;
SELECT COUNT(*) FROM lis.finished_plans_path WHERE planid = <planId>;
SELECT COUNT(*) FROM lis.attachments a
  JOIN lis.finished_plans f ON f.point_id = a.point_id
  WHERE f.plan_id = <planId>;
```

- [ ] **Step 2: Upload a plan normally**

Confirm the counts increase as expected and the plan appears on the website.

- [ ] **Step 3: Force a replay**

Re-send the identical POST body. The simplest reliable way is DevTools →
Network → the `finished_plans` request → **Copy as fetch**, then paste it into
the console and run it a second time.

Expected response:

```json
{ "message": "Vluchtplan was al opgeslagen", "planId": <planId>, "replayed": true }
```

- [ ] **Step 4: Confirm no duplicates**

Re-run the Step 1 queries. Expected: **identical counts.**

Also confirm the guard query returns nothing:

```sql
SELECT plan_id, point_id, COUNT(*)
FROM lis.finished_plans
GROUP BY plan_id, point_id
HAVING COUNT(*) > 1;
```

- [ ] **Step 5: Confirm an old client still works**

Re-send the same body with `uploadId` removed. Expected: `200`, and it inserts —
proving backward compatibility for desktop builds that predate Task 5.
Clean up the rows this creates.

- [ ] **Step 6: Record the result**

Append a `## Verification log` section to this file with the date, the observed
responses, and the before/after counts.

- [ ] **Step 7: Commit**

```bash
git add planning/batch-4-upload-resilience.md
git commit -m "planning: record batch 4 verification"
```

---

## Done when

- [ ] `npm test` and `npm run test:electron` pass in LIS-Desktop; `npm run test:upload-id` passes in the backend
- [ ] Killing the app mid-upload leaves `attachments` in the plan JSON, and the retry skips those points
- [ ] A four-minute-plus ArcGIS phase no longer ends in a 401 on the final POST
- [ ] Replaying an identical POST returns `replayed: true` and creates no rows
- [ ] A POST with no `uploadId` still succeeds
- [ ] `npx tsc -b --noEmit` (Desktop) and `npx tsc --noEmit` (backend) are clean
