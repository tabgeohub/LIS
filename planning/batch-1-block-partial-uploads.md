# Batch 1 — Block Partial Uploads (W-02) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop LIS-Desktop from reporting a successful upload when photos were missing, so the operator is told before the plan is committed and removed from the pending list.

**Architecture:** Today the per-point attachment failure is caught, recorded in a local `failedPoints` array, and then discarded — the POST goes ahead and the status text is overwritten with a success message. This batch hoists an existence check for *all* photos ahead of the first ArcGIS write, makes the outcome a first-class return value, and refuses to POST while any photo is unaccounted for. The decision logic goes in a pure module so it can be unit-tested; the React hooks only wire it up.

**Tech Stack:** Electron 28, React 19, TypeScript 5.7, Vite 6, Vitest 3 (added in Task 1), `node:test` for the Electron main process.

**Spec:** `../../lis-upload-weaknesses.html` (finding W-02; W-01 is the root cause and is fixed in Batch 3)

## Global Constraints

- **Repo:** `LIS-Desktop` only. No backend or web changes in this batch.
- **No on-disk schema change.** The `flightPlan.json` format is untouched here — see `SPEC-plan-json-schema.md`; v2 arrives in Batch 3.
- **User-facing strings are Dutch**, matching `SESSION_EXPIRED_UPLOAD_MESSAGE` in `src/utils/sessionAuth.ts`.
- **Path aliases** already configured in `vite.config.ts`: `@components`, `@consts`, `@helpers`, `@hooks`, `@utils`, `@types`, `@config`. Use them; do not add relative `../../..` imports.
- **Electron main process is ESM** (`"type": "module"` in `package.json`) except `preload.cjs`, which is CommonJS.
- After this batch, an upload that would previously have silently dropped photos must **leave the plan in `finishedPlans[]`** so it can be retried once the photos are restored.

## File Structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` *(new)* | Test runner config; reuses `vite.config.ts` aliases |
| `electron/helpers/imageStorage.js` | Gains a cheap `point-image-exists` handler (existence only, no base64) |
| `electron/preload.cjs` | Exposes `pointImageExists` |
| `src/types.ts` | Declares `pointImageExists` on `Window.electron` |
| `.../FirstModal/hooks/uploadPreflight.ts` *(new)* | **Pure.** Decides whether an upload may proceed and builds the operator message |
| `.../FirstModal/hooks/uploadPreflight.test.ts` *(new)* | Unit tests for the above |
| `.../FirstModal/hooks/useProcessPlan.ts` | Runs the preflight before any ArcGIS write; throws a typed block |
| `.../FirstModal/hooks/useSavFinishedPoints.ts` | Handles the block: no POST, plan stays pending, honest status |
| `.../FirstModal/index.tsx` | Renders the blocked state and the override control |

`.../FirstModal/` is shorthand for `src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/`.

---

### Task 1: Add Vitest to LIS-Desktop

There is no test runner for `src/` today — the only test script is `test:login`, which runs `node --test` against an Electron helper. The sibling repo (`LIS`) already uses Vitest, and this project already builds with Vite 6, so Vitest is the consistent choice. Every later batch depends on this task.

**Files:**
- Modify: `LIS-Desktop/package.json`
- Create: `LIS-Desktop/vitest.config.ts`
- Create: `LIS-Desktop/src/utils/smoke.test.ts` *(deleted at the end of this task)*

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` runs Vitest over `src/**/*.test.ts`; `npm run test:electron` runs the existing `node:test` suites

- [ ] **Step 1: Install Vitest**

```bash
cd LIS-Desktop
npm install --save-dev vitest@^3.0.0
```

- [ ] **Step 2: Create the Vitest config**

Vitest reads `vite.config.ts` automatically, so the `@…` aliases come for free. Only the `test` block is needed. Create `LIS-Desktop/vitest.config.ts`:

```ts
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
      // The Electron main process is tested with `node --test` instead.
      exclude: ["node_modules/**", "dist/**", "release/**", "electron/**"],
    },
  })
);
```

- [ ] **Step 3: Add the scripts**

In `LIS-Desktop/package.json`, replace the existing `"test:login"` line with:

```json
    "test": "vitest run",
    "test:watch": "vitest",
    "test:electron": "node --test electron/helpers/*.test.mjs",
    "test:login": "node --test electron/helpers/desktopLoginUrl.test.mjs",
```

- [ ] **Step 4: Write a smoke test to prove the runner and aliases work**

Create `LIS-Desktop/src/utils/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isUnauthorizedError } from "@utils/sessionAuth";

describe("vitest wiring", () => {
  it("resolves the @utils alias and runs assertions", () => {
    expect(isUnauthorizedError({ response: { status: 401 } })).toBe(true);
    expect(isUnauthorizedError({ response: { status: 500 } })).toBe(false);
  });
});
```

- [ ] **Step 5: Run it and verify it passes**

```bash
npm test
```

Expected: `1 passed`. If the alias fails to resolve, the `mergeConfig` in Step 2 is not picking up `vite.config.ts` — check the import path.

- [ ] **Step 6: Verify the Electron suite still runs**

```bash
npm run test:electron
```

Expected: the `desktopLoginUrl` tests pass (5 tests).

- [ ] **Step 7: Delete the smoke test**

It has done its job; the real tests arrive in Task 3.

```bash
rm src/utils/smoke.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add vitest runner for src/"
```

---

### Task 2: Add a cheap image-existence check to the main process

The current pre-check calls `pointImageToDataURL`, which reads the whole file and base64-encodes it purely to find out whether it exists. Doing that for every photo in a plan up front would move hundreds of megabytes through the renderer. This task adds an existence-only IPC.

**Files:**
- Modify: `LIS-Desktop/electron/helpers/imageStorage.js`
- Modify: `LIS-Desktop/electron/preload.cjs`
- Modify: `LIS-Desktop/src/types.ts:5-…` (the `Window.electron` interface)

**Interfaces:**
- Consumes: nothing
- Produces: `window.electron.pointImageExists(filePath: string): Promise<{ exists: boolean; size: number }>`

- [ ] **Step 1: Add the handler**

In `LIS-Desktop/electron/helpers/imageStorage.js`, inside `registerImageStorageHandlers()`, add after the `delete-point-image` handler:

```js
  // Existence + size only. Deliberately does NOT read the file — the upload
  // preflight checks every photo in a plan, and base64-encoding them all would
  // move hundreds of MB through the renderer.
  ipcMain.handle("point-image-exists", async (event, filePath) => {
    if (!filePath || typeof filePath !== "string") {
      return { exists: false, size: 0 };
    }
    try {
      const stats = await fs.promises.stat(filePath);
      return { exists: stats.isFile() && stats.size > 0, size: stats.size };
    } catch {
      return { exists: false, size: 0 };
    }
  });
```

- [ ] **Step 2: Expose it in the preload**

In `LIS-Desktop/electron/preload.cjs`, next to the other image entries (after `pointImageToDataURL`):

```js
  pointImageExists: (filePath) =>
    ipcRenderer.invoke("point-image-exists", filePath),
```

- [ ] **Step 3: Declare the type**

In `LIS-Desktop/src/types.ts`, inside `interface Window { electron?: { … } }`, next to the other image members:

```ts
      pointImageExists?: (
        filePath: string
      ) => Promise<{ exists: boolean; size: number }>;
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 5: Manually verify the IPC in the running app**

```bash
npm run dev
```

In the app's DevTools console (F12):

```js
await window.electron.pointImageExists("C:/does/not/exist.jpg")
// → { exists: false, size: 0 }
```

- [ ] **Step 6: Commit**

```bash
git add electron/helpers/imageStorage.js electron/preload.cjs src/types.ts
git commit -m "feature: add point-image-exists IPC for upload preflight"
```

---

### Task 3: Write the pure preflight module

All the decision-making lives here so it can be tested without Electron, React, or ArcGIS.

**Files:**
- Create: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadPreflight.ts`
- Create: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadPreflight.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type PreflightPoint = { id: number; omschrijving?: string | null; images?: { filePath?: string | null }[] | null }`
  - `type PreflightResult = { ok: boolean; missingByPointId: Record<number, string[]>; missingCount: number; affectedPointIds: number[] }`
  - `preflightPointImages(points: PreflightPoint[], isReadable: (filePath: string) => Promise<boolean>): Promise<PreflightResult>`
  - `describePreflightFailure(result: PreflightResult): string`
  - `class UploadBlockedError extends Error { readonly result: PreflightResult }`

- [ ] **Step 1: Write the failing tests**

Create `.../FirstModal/hooks/uploadPreflight.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  describePreflightFailure,
  preflightPointImages,
  UploadBlockedError,
  type PreflightPoint,
} from "./uploadPreflight";

const allReadable = async () => true;
const noneReadable = async () => false;

describe("preflightPointImages", () => {
  it("passes when every photo is readable", async () => {
    const points: PreflightPoint[] = [
      { id: 1, images: [{ filePath: "a.jpg" }, { filePath: "b.jpg" }] },
      { id: 2, images: [{ filePath: "c.jpg" }] },
    ];
    const result = await preflightPointImages(points, allReadable);
    expect(result.ok).toBe(true);
    expect(result.missingCount).toBe(0);
    expect(result.affectedPointIds).toEqual([]);
  });

  it("passes when points have no photos at all", async () => {
    const points: PreflightPoint[] = [
      { id: 1, images: [] },
      { id: 2, images: null },
      { id: 3 },
    ];
    const result = await preflightPointImages(points, noneReadable);
    expect(result.ok).toBe(true);
    expect(result.missingCount).toBe(0);
  });

  it("fails and reports which points lost which files", async () => {
    const points: PreflightPoint[] = [
      { id: 7, images: [{ filePath: "ok.jpg" }, { filePath: "gone.jpg" }] },
      { id: 9, images: [{ filePath: "alsogone.jpg" }] },
    ];
    const isReadable = async (p: string) => p === "ok.jpg";

    const result = await preflightPointImages(points, isReadable);

    expect(result.ok).toBe(false);
    expect(result.missingCount).toBe(2);
    expect(result.affectedPointIds).toEqual([7, 9]);
    expect(result.missingByPointId).toEqual({
      7: ["gone.jpg"],
      9: ["alsogone.jpg"],
    });
  });

  it("treats an image entry with no filePath as missing", async () => {
    const points: PreflightPoint[] = [
      { id: 3, images: [{ filePath: "" }, { filePath: null }, {}] },
    ];
    const result = await preflightPointImages(points, allReadable);
    expect(result.ok).toBe(false);
    expect(result.missingCount).toBe(3);
  });

  it("treats a thrown readability check as missing rather than crashing", async () => {
    const points: PreflightPoint[] = [{ id: 4, images: [{ filePath: "x.jpg" }] }];
    const isReadable = async () => {
      throw new Error("IPC unavailable");
    };
    const result = await preflightPointImages(points, isReadable);
    expect(result.ok).toBe(false);
    expect(result.missingByPointId[4]).toEqual(["x.jpg"]);
  });

  it("checks each distinct path only once", async () => {
    const seen: string[] = [];
    const isReadable = async (p: string) => {
      seen.push(p);
      return true;
    };
    const points: PreflightPoint[] = [
      { id: 1, images: [{ filePath: "same.jpg" }] },
      { id: 2, images: [{ filePath: "same.jpg" }] },
    ];
    await preflightPointImages(points, isReadable);
    expect(seen).toEqual(["same.jpg"]);
  });
});

describe("describePreflightFailure", () => {
  it("names the point count and the photo count in Dutch", () => {
    const message = describePreflightFailure({
      ok: false,
      missingCount: 3,
      affectedPointIds: [7, 9],
      missingByPointId: { 7: ["a.jpg", "b.jpg"], 9: ["c.jpg"] },
    });
    expect(message).toContain("2 punten");
    expect(message).toContain("3 foto");
    expect(message).toContain("niet geüpload");
  });

  it("uses the singular form for a single point and photo", () => {
    const message = describePreflightFailure({
      ok: false,
      missingCount: 1,
      affectedPointIds: [7],
      missingByPointId: { 7: ["a.jpg"] },
    });
    expect(message).toContain("1 punt ");
    expect(message).not.toContain("punten");
  });
});

describe("UploadBlockedError", () => {
  it("carries the result so the caller can render detail", () => {
    const result = {
      ok: false as const,
      missingCount: 1,
      affectedPointIds: [1],
      missingByPointId: { 1: ["a.jpg"] },
    };
    const error = new UploadBlockedError(result);
    expect(error).toBeInstanceOf(Error);
    expect(error.result).toBe(result);
    expect(error.name).toBe("UploadBlockedError");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test -- uploadPreflight
```

Expected: FAIL — `Failed to resolve import "./uploadPreflight"`.

- [ ] **Step 3: Write the implementation**

Create `.../FirstModal/hooks/uploadPreflight.ts`:

```ts
/**
 * Pure upload preflight.
 *
 * The device is offline for the whole flight and the upload happens hours
 * later, so a photo that existed at capture time may be gone by the time we
 * try to send it (see W-01). Before this module existed, that produced a
 * successful-looking upload with silently missing imagery (W-02).
 *
 * No Electron, React or ArcGIS imports — everything here is unit-testable.
 */

export type PreflightPoint = {
  id: number;
  omschrijving?: string | null;
  images?: { filePath?: string | null }[] | null;
};

export type PreflightResult = {
  ok: boolean;
  /** Point id -> the paths that could not be read. */
  missingByPointId: Record<number, string[]>;
  missingCount: number;
  affectedPointIds: number[];
};

export class UploadBlockedError extends Error {
  readonly result: PreflightResult;

  constructor(result: PreflightResult) {
    super(describePreflightFailure(result));
    this.name = "UploadBlockedError";
    this.result = result;
  }
}

/**
 * Verifies every photo referenced by the plan is readable, BEFORE anything is
 * written to ArcGIS. Distinct paths are checked once and the result reused, so
 * a plan that reuses a file does not pay for it twice.
 */
export async function preflightPointImages(
  points: PreflightPoint[],
  isReadable: (filePath: string) => Promise<boolean>
): Promise<PreflightResult> {
  const cache = new Map<string, boolean>();

  const readable = async (filePath: string): Promise<boolean> => {
    const cached = cache.get(filePath);
    if (cached !== undefined) return cached;

    let ok = false;
    try {
      ok = await isReadable(filePath);
    } catch {
      // An IPC failure is indistinguishable from a missing file from here, and
      // the safe reading is "missing" — better a blocked upload than a silent
      // one.
      ok = false;
    }

    cache.set(filePath, ok);
    return ok;
  };

  const missingByPointId: Record<number, string[]> = {};

  for (const point of points ?? []) {
    const images = point.images ?? [];
    const missing: string[] = [];

    for (const image of images) {
      const filePath = image?.filePath;

      if (!filePath) {
        // An image entry with no path can never be uploaded.
        missing.push(String(filePath ?? ""));
        continue;
      }

      if (!(await readable(filePath))) {
        missing.push(filePath);
      }
    }

    if (missing.length > 0) {
      missingByPointId[point.id] = missing;
    }
  }

  const affectedPointIds = Object.keys(missingByPointId).map(Number);
  const missingCount = Object.values(missingByPointId).reduce(
    (total, paths) => total + paths.length,
    0
  );

  return {
    ok: missingCount === 0,
    missingByPointId,
    missingCount,
    affectedPointIds,
  };
}

export function describePreflightFailure(result: PreflightResult): string {
  const pointCount = result.affectedPointIds.length;
  const pointWord = pointCount === 1 ? "punt" : "punten";
  const photoWord = result.missingCount === 1 ? "foto" : "foto's";

  return (
    `${pointCount} ${pointWord} ${result.missingCount === 1 ? "mist" : "missen"} ` +
    `${result.missingCount} ${photoWord} op de schijf. ` +
    `Er is niets niet geüpload — het vluchtplan blijft in de wachtrij staan. ` +
    `Herstel de bestanden en probeer opnieuw.`
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test -- uploadPreflight
```

Expected: PASS, 9 tests.

If `describePreflightFailure` assertions fail on the singular test, check that the message contains `"1 punt "` with a trailing space — the assertion deliberately guards against `"punten"` matching.

- [ ] **Step 5: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadPreflight.ts" \
        "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/uploadPreflight.test.ts"
git commit -m "feature: pure upload preflight for missing photo detection"
```

---

### Task 4: Run the preflight before any ArcGIS write

`useProcessPlan` currently calls `assertUploadAuthReady`, takes the upload lock, and starts creating ArcGIS features immediately. This task inserts the preflight between the auth check and the lock, so a plan that cannot upload cleanly never creates a single orphan feature.

**Files:**
- Modify: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useProcessPlan.ts`

**Interfaces:**
- Consumes: `preflightPointImages`, `UploadBlockedError` from `./uploadPreflight`; `window.electron.pointImageExists` from Task 2
- Produces: `processPlan` throws `UploadBlockedError` when photos are missing; otherwise unchanged

- [ ] **Step 1: Add the imports**

At the top of `useProcessPlan.ts`, alongside the existing imports:

```ts
import { preflightPointImages, UploadBlockedError } from "./uploadPreflight";
```

- [ ] **Step 2: Insert the preflight**

In the returned `processPlan` function, immediately after `await assertUploadAuthReady(setStatusText);` and **before** `setUploadAuthLock(true);`:

```ts
      setStatusText("Foto's controleren...");

      const preflight = await preflightPointImages(
        plan.points ?? [],
        async (filePath: string) => {
          const result = await window.electron?.pointImageExists?.(filePath);
          return Boolean(result?.exists);
        }
      );

      if (!preflight.ok) {
        void logAction(
          `Upload geblokkeerd: ${preflight.missingCount} ontbrekende foto's`,
          null,
          {
            planId: plan?.id,
            affectedPointIds: preflight.affectedPointIds,
            missingByPointId: preflight.missingByPointId,
          }
        );
        throw new UploadBlockedError(preflight);
      }
```

- [ ] **Step 3: Remove the now-redundant per-point file check**

The block at `useUploadAttachmentsForPoint.ts` that pre-validates files per point (the loop building `missingFiles`, ending in the `throw new Error(...)` about files not found) is now dead weight for the common path — the preflight has already proven every file readable. **Leave it in place.** It still guards the narrow window between preflight and upload, and removing it would widen that gap. Add a comment above it so the next reader knows it is intentional defence-in-depth:

```ts
    // Defence in depth: uploadPreflight already verified every file before we
    // took the upload lock. This re-check covers the (small) window between
    // that check and this point.
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useProcessPlan.ts" \
        "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useUploadAttachmentsForPoint.ts"
git commit -m "fix: run photo preflight before any ArcGIS write"
```

---

### Task 5: Refuse to POST and keep the plan pending

`useSavFinishedPoints` currently catches every error the same way. A blocked upload must be distinguishable from a failed one: nothing was sent, nothing was lost, and the plan must stay in `finishedPlans[]` so it can be retried.

**Files:**
- Modify: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useSavFinishedPoints.ts`

**Interfaces:**
- Consumes: `UploadBlockedError` from `./uploadPreflight`
- Produces: `savePoints()` still returns `Promise<boolean>`; a blocked upload returns `false` **without** clearing auth state or removing the plan from `localData` / `finishedPlans[]`

- [ ] **Step 1: Import the error type and add blocked state**

At the top of `useSavFinishedPoints.ts`:

```ts
import { UploadBlockedError, type PreflightResult } from "./uploadPreflight";
```

Change the hook signature to accept a setter for the blocked detail (add as the last parameter):

```ts
export default function useSavFinishedPoints(
  setOpenModal1: (value: boolean) => void,
  setOpenModal2: (value: boolean) => void,
  setLoading: (value: boolean) => void,
  setProgress: (value: number) => void,
  setStatusText: (value: string) => void,
  selectedPlan: FlightPlanType | null,
  setBlocked: (value: PreflightResult | null) => void
) {
```

- [ ] **Step 2: Clear any previous block at the start of `savePoints`**

Immediately after `setLoading(true);` in the `try` block:

```ts
      setBlocked(null);
```

- [ ] **Step 3: Handle the block ahead of the generic error path**

In the `catch (err: any)` block, as the **first** thing after `setLoading(false);`:

```ts
      if (err instanceof UploadBlockedError) {
        // Nothing was sent and nothing was lost. Deliberately do NOT clear auth
        // state, do NOT close the modal, and do NOT prune finishedPlans[] —
        // the operator must be able to restore the files and retry.
        setBlocked(err.result);
        setStatusText(err.message);
        setProgress(0);
        toast.error(err.message);
        return false;
      }
```

- [ ] **Step 4: Verify the success path is unreachable when blocked**

Read the function top to bottom and confirm that when `processPlan` throws, execution never reaches `saveFlightPlan(...)`, `setOpenModal2(true)`, the `setLocalData(...)` prune, or the `localforage.setItem("finishedPlans", …)` prune. All of those sit after the `await processPlan(...)` call inside the same `try`, so the throw skips them — no change needed, but confirm it rather than assuming.

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: one error at the `useSavFinishedPoints(...)` call site in `Buttons.tsx` — it is missing the new seventh argument. Task 6 fixes it.

- [ ] **Step 6: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/hooks/useSavFinishedPoints.ts"
git commit -m "fix: keep plan pending when upload is blocked by missing photos"
```

---

### Task 6: Show the operator what is missing

**Files:**
- Modify: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/index.tsx`
- Modify: `LIS-Desktop/src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/Buttons.tsx`

**Interfaces:**
- Consumes: `PreflightResult` from `./hooks/uploadPreflight`
- Produces: the modal renders the blocked detail; the OK button is disabled while blocked

- [ ] **Step 1: Hold the blocked state in the modal**

In `FirstModal/index.tsx`, add alongside the existing `useState` calls:

```tsx
  const [blocked, setBlocked] = useState<PreflightResult | null>(null);
```

with the import:

```tsx
import type { PreflightResult } from "./hooks/uploadPreflight";
```

- [ ] **Step 2: Pass it down to `Buttons`**

Add `blocked` and `setBlocked` to the props already passed to `<Buttons … />`.

- [ ] **Step 3: Render the detail**

Above the `<Buttons />` element in `FirstModal/index.tsx`:

```tsx
      {blocked && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm">
          <p className="font-semibold text-red-800">
            Upload gestopt — ontbrekende foto's
          </p>
          <p className="mt-1 text-red-900">
            {blocked.missingCount} foto&apos;s van{" "}
            {blocked.affectedPointIds.length} punt
            {blocked.affectedPointIds.length === 1 ? "" : "en"} zijn niet meer op
            de schijf te vinden. Er is niets geüpload en het vluchtplan blijft in
            de wachtrij staan.
          </p>
          <ul className="mt-2 max-h-32 list-disc overflow-y-auto pl-5 text-xs text-red-900">
            {Object.entries(blocked.missingByPointId).map(([pointId, paths]) => (
              <li key={pointId}>
                Punt {pointId}: {paths.length} bestand
                {paths.length === 1 ? "" : "en"}
              </li>
            ))}
          </ul>
        </div>
      )}
```

- [ ] **Step 4: Wire the new hook argument and disable OK while blocked**

In `FirstModal/Buttons.tsx`, accept the two new props, pass `setBlocked` through as the seventh argument to `useSavFinishedPoints(...)`, and extend the OK button's `disabled`:

```tsx
        disabled={loading || selectedPlan === null || blocked !== null}
```

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors (this resolves the one from Task 5).

- [ ] **Step 6: Run the full suite**

```bash
npm test && npm run test:electron
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/index.tsx" \
        "src/Components/Main/Left/Actions/UploadFlightPlan/FirstModal/Buttons.tsx"
git commit -m "feature: show blocked upload detail in the upload modal"
```

---

### Task 7: End-to-end verification against a real plan

The unit tests prove the decision logic. This proves the wiring.

**Files:** none modified.

- [ ] **Step 1: Produce a plan with photos**

```bash
npm run dev
```

Log in, open a prepared flight plan, add a point with at least one photo, press **Verstuur**. Confirm `C:/lis-temp-data/<vluchtnummer>/flightPlan.json` exists and its point has a populated `images[]`.

- [ ] **Step 2: Simulate the multi-hour gap by deleting a photo**

Read the `filePath` of one image out of `flightPlan.json`, then:

```powershell
Remove-Item "<that exact filePath>"
```

- [ ] **Step 3: Attempt the upload**

Log in again, choose **Een vluchtplan uploaden**, select the plan, press OK.

Expected:
- status text reports the missing photos in Dutch
- the red detail panel lists the affected point
- the OK button is disabled
- **no** success modal
- ArcGIS `attachments_layer` gained **no** new features
- the plan is still listed under **Een vluchtplan uploaden**

- [ ] **Step 4: Restore the file and confirm the upload now succeeds**

Put the photo back at the same path, reopen the upload modal, press OK. Expected: normal successful upload, plan disappears from the pending list, row appears on the website.

- [ ] **Step 5: Record the result**

Append to this file under a `## Verification log` heading: date, app version, and the observed outcome of Steps 3 and 4.

- [ ] **Step 6: Commit**

```bash
git add ../LIS/planning/batch-1-block-partial-uploads.md
git commit -m "planning: record batch 1 end-to-end verification"
```

---

## Done when

- [ ] `npm test` and `npm run test:electron` both pass
- [ ] A plan with a deleted photo cannot be uploaded, and says why
- [ ] That plan remains in `finishedPlans[]` and uploads successfully once the file is restored
- [ ] No ArcGIS features are created for a blocked upload
- [ ] `npx tsc -b --noEmit` is clean
