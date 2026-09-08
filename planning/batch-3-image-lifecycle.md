# Batch 3 — Image Lifecycle (W-01, W-12) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the plan folder self-contained, so a flight's photos survive the hours between Verstuur and upload regardless of what happens to the camera's own folder.

**Architecture:** Today a photo is only ever *referenced* by an absolute path into `%USERPROFILE%\Pictures\Lis` — the bytes are never copied, and are read for the first time at upload, potentially hours later. This batch copies each photo into `<plan folder>/images/` at the moment it is attached, stores a path relative to the plan folder, and resolves that path on read with the absolute path kept only as a fallback for plans written by older builds. The same change removes the shared-folder ambiguity behind W-12, which is then closed properly by having the file watcher — not an mtime scan — decide what "the latest photo" is.

**Tech Stack:** Electron 28 (ESM main process), `node:test`, React 19, TypeScript 5.7, Vitest 3.

**Spec:** `../../lis-upload-weaknesses.html` (findings W-01, W-12) and `./SPEC-plan-json-schema.md` (the v2 on-disk format this batch introduces)

## Global Constraints

- **Repo:** `LIS-Desktop` only.
- **Depends on Batch 1** (Vitest) and **Batch 2** (`planFiles.js`, atomic writes, canonical folder names).
- **This batch introduces schema v2.** Implement exactly what `SPEC-plan-json-schema.md` specifies — in particular: `relPath` uses forward slashes, `filePath` is **retained** so a downgrade degrades rather than breaks, and v1 images are **not** backfilled.
- **A v1 plan sitting on a device must still upload.** Every read path needs the `filePath` fallback.
- **Copy, never move.** The camera folder is not ours to mutate; moving files would break other tooling and make the operation unrecoverable if the app crashes mid-attach.
- If Batch 0 Q2 returned **`ONEDRIVE_BACKED`**, `C:/lis-temp-data` must be confirmed to sit outside any synced folder before starting — otherwise this batch moves the problem rather than fixing it.

## File Structure

| File | Responsibility |
|---|---|
| `electron/helpers/planSchema.js` *(new)* | **Pure.** Schema version constant, `migratePlan`, `resolvePlanImagePath` |
| `electron/helpers/planSchema.test.mjs` *(new)* | `node --test` suite for the above |
| `electron/helpers/imageStorage.js` | Copies photos into the plan folder; resolves `relPath` on every read |
| `electron/images-logic/imageWatcher.js` | Becomes the source of truth for "the latest photo" |
| `electron/images-logic/latestImage.js` | Serves the watcher's record instead of scanning by mtime |
| `electron/preload.cjs` | Payload for `registerPointImagePath` gains `vluchtnummer` + `pointId` |
| `src/types.ts` | `PointImage.relPath`; updated IPC signatures |
| `src/hooks/useHandleAddNewPoint.ts` | Passes plan context when registering a photo |

---

### Task 1: Create the pure schema module

**Files:**
- Create: `LIS-Desktop/electron/helpers/planSchema.js`
- Create: `LIS-Desktop/electron/helpers/planSchema.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `CURRENT_SCHEMA_VERSION = 2`
  - `migratePlan(plan: any): any`
  - `planImageRelPath(pointId: number, timestamp: number, sourcePath: string): string`
  - `resolvePlanImagePath(planFolder: string, image: { relPath?: string; filePath?: string }): string | null`

- [ ] **Step 1: Write the failing tests**

Create `LIS-Desktop/electron/helpers/planSchema.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  CURRENT_SCHEMA_VERSION,
  migratePlan,
  planImageRelPath,
  resolvePlanImagePath,
} from "./planSchema.js";

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "lis-planschema-"));
}

test("migratePlan stamps the version on a legacy plan", () => {
  const migrated = migratePlan({ id: 1, vluchtnummer: "A-1" });
  assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.equal(migrated.id, 1);
});

test("migratePlan leaves a current plan untouched", () => {
  const plan = { schemaVersion: CURRENT_SCHEMA_VERSION, id: 2 };
  assert.equal(migratePlan(plan), plan);
});

test("migratePlan does not mutate its input", () => {
  const plan = { id: 3 };
  migratePlan(plan);
  assert.equal(plan.schemaVersion, undefined);
});

test("migratePlan passes through null and non-objects", () => {
  assert.equal(migratePlan(null), null);
  assert.equal(migratePlan(undefined), undefined);
  assert.equal(migratePlan("x"), "x");
});

test("planImageRelPath builds a POSIX path under images/", () => {
  assert.equal(
    planImageRelPath(-1, 1757068790000, "C:\\Pictures\\Lis\\IMG_0042.JPG"),
    "images/-1-1757068790000.jpg"
  );
  assert.equal(
    planImageRelPath(42, 1700000000000, "/home/x/a.png"),
    "images/42-1700000000000.png"
  );
});

test("planImageRelPath falls back to .jpg when there is no extension", () => {
  assert.equal(planImageRelPath(1, 5, "noext"), "images/1-5.jpg");
});

test("resolvePlanImagePath prefers relPath when the file exists", () => {
  const folder = tmpDir();
  fs.mkdirSync(path.join(folder, "images"));
  const target = path.join(folder, "images", "1-5.jpg");
  fs.writeFileSync(target, "x", "utf-8");

  const resolved = resolvePlanImagePath(folder, {
    relPath: "images/1-5.jpg",
    filePath: "C:/elsewhere/gone.jpg",
  });
  assert.equal(resolved, target);
});

test("resolvePlanImagePath falls back to filePath for a legacy image", () => {
  const folder = tmpDir();
  const legacy = path.join(folder, "legacy.jpg");
  fs.writeFileSync(legacy, "x", "utf-8");

  assert.equal(
    resolvePlanImagePath(folder, { filePath: legacy }),
    legacy
  );
});

test("resolvePlanImagePath falls back when relPath is recorded but missing", () => {
  const folder = tmpDir();
  const legacy = path.join(folder, "legacy.jpg");
  fs.writeFileSync(legacy, "x", "utf-8");

  assert.equal(
    resolvePlanImagePath(folder, {
      relPath: "images/not-copied.jpg",
      filePath: legacy,
    }),
    legacy
  );
});

test("resolvePlanImagePath returns null when nothing resolves", () => {
  const folder = tmpDir();
  assert.equal(resolvePlanImagePath(folder, {}), null);
  assert.equal(
    resolvePlanImagePath(folder, { relPath: "images/x.jpg" }),
    null
  );
});

test("resolvePlanImagePath refuses a relPath that escapes the plan folder", () => {
  const folder = tmpDir();
  assert.equal(
    resolvePlanImagePath(folder, { relPath: "../../windows/system32/x.jpg" }),
    null
  );
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd LIS-Desktop
node --test electron/helpers/planSchema.test.mjs
```

Expected: FAIL — `Cannot find module './planSchema.js'`.

- [ ] **Step 3: Implement the module**

Create `LIS-Desktop/electron/helpers/planSchema.js`:

```js
/**
 * On-disk plan schema: version marker, migration, and image path resolution.
 * See LIS/planning/SPEC-plan-json-schema.md for the format contract.
 *
 * Pure except for existence checks — no electron import, so `node --test` runs it.
 */
import fs from "fs";
import path from "path";

export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Upgrade a plan read from disk. Forward-only and lossless.
 *
 * v1 images are deliberately NOT backfilled with relPath: their files live
 * outside the plan folder, and copying them here would turn "open the plan
 * list" into a long blocking I/O operation. They keep working through the
 * filePath fallback in resolvePlanImagePath.
 */
export function migratePlan(plan) {
  if (!plan || typeof plan !== "object") return plan;

  const version = Number(plan.schemaVersion) || 1;
  if (version >= CURRENT_SCHEMA_VERSION) return plan;

  return { ...plan, schemaVersion: CURRENT_SCHEMA_VERSION };
}

/** Stable, collision-free name for a photo copied into the plan folder. */
export function planImageRelPath(pointId, timestamp, sourcePath) {
  const ext = (path.extname(String(sourcePath ?? "")) || ".jpg").toLowerCase();
  return `images/${pointId}-${timestamp}${ext}`;
}

/**
 * Resolve a stored image reference to a readable absolute path.
 *
 * relPath (inside the plan folder) always wins; filePath is only consulted for
 * plans written before the copy-on-attach change, and for the downgrade case
 * described in the spec.
 */
export function resolvePlanImagePath(planFolder, image) {
  if (!image || typeof image !== "object") return null;

  if (image.relPath) {
    const candidate = path.resolve(planFolder, image.relPath);
    const root = path.resolve(planFolder);

    // Never let a stored path escape the plan folder.
    const inside =
      candidate === root || candidate.startsWith(root + path.sep);

    if (inside && fs.existsSync(candidate)) return candidate;
  }

  if (image.filePath && fs.existsSync(image.filePath)) {
    return image.filePath;
  }

  return null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test electron/helpers/planSchema.test.mjs
```

Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add electron/helpers/planSchema.js electron/helpers/planSchema.test.mjs
git commit -m "feature: plan schema v2 helpers with image path resolution"
```

---

### Task 2: Copy photos into the plan folder on attach

**Files:**
- Modify: `LIS-Desktop/electron/helpers/imageStorage.js`
- Modify: `LIS-Desktop/electron/preload.cjs`
- Modify: `LIS-Desktop/src/types.ts`

**Interfaces:**
- Consumes: `planImageRelPath`, `resolvePlanImagePath` (Task 1); `BASE_DIR`, `resolveFolder`, `ensureDir` (Batch 2)
- Produces: `registerPointImagePath({ filePath, timestamp?, vluchtnummer, pointId })` returns `{ filePath, relPath, fileUrl, mimeType, size, timestamp }`

- [ ] **Step 1: Rewrite the register handler**

In `LIS-Desktop/electron/helpers/imageStorage.js`, add to the imports:

```js
import { BASE_DIR, ensureDir, resolveFolder } from "./planFiles.js";
import { planImageRelPath, resolvePlanImagePath } from "./planSchema.js";
```

Replace the whole `register-point-image-path` handler with:

```js
  // Copies the photo INTO the plan folder. The camera folder is not ours: the
  // device is offline for hours between capture and upload, and anything that
  // cleans Pictures\Lis in that window used to destroy the flight's imagery
  // (W-01). The absolute source path is kept for provenance and as a fallback
  // for plans written by older builds.
  ipcMain.handle("register-point-image-path", async (event, payload = {}) => {
    const {
      filePath,
      timestamp = Date.now(),
      vluchtnummer,
      pointId,
    } = payload;

    if (!filePath) {
      throw new Error("filePath is required");
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    const mimeType = mime.getType(filePath) || "image/jpeg";

    // Without plan context we cannot copy anywhere sensible; fall back to the
    // old reference-only behaviour rather than losing the attachment.
    if (!vluchtnummer || pointId === undefined || pointId === null) {
      const stats = await fs.promises.stat(filePath);
      console.warn(
        "[imageStorage] register without plan context — storing reference only"
      );
      return {
        filePath,
        relPath: null,
        fileUrl: getImageUrl(filePath),
        mimeType,
        size: stats.size,
        timestamp,
      };
    }

    const planFolder = resolveFolder(BASE_DIR, vluchtnummer);
    const relPath = planImageRelPath(pointId, timestamp, filePath);
    const destination = path.join(planFolder, relPath);

    ensureDir(path.dirname(destination));
    await fs.promises.copyFile(filePath, destination);

    const stats = await fs.promises.stat(destination);

    return {
      filePath,
      relPath,
      fileUrl: getImageUrl(destination),
      mimeType,
      size: stats.size,
      timestamp,
    };
  });
```

- [ ] **Step 2: Make every read path resolve through the plan folder**

Still in `imageStorage.js`, replace the `point-image-to-dataurl`, `point-image-exists` (added in Batch 1) and `delete-point-image` handlers so they accept either a bare path (legacy callers) or `{ image, vluchtnummer }`:

```js
  function resolveRequest(request) {
    // Legacy callers pass a bare absolute path.
    if (typeof request === "string") return request;

    const { image, vluchtnummer } = request ?? {};
    if (!image) return null;

    if (vluchtnummer) {
      const planFolder = resolveFolder(BASE_DIR, vluchtnummer);
      return resolvePlanImagePath(planFolder, image);
    }

    return image.filePath ?? null;
  }

  ipcMain.handle("point-image-to-dataurl", async (event, request) => {
    const resolved = resolveRequest(request);

    if (!resolved) {
      throw new Error("Image could not be resolved to a path");
    }
    if (!fs.existsSync(resolved)) {
      throw new Error(
        `Image file not found: ${resolved}. The file may have been moved or deleted.`
      );
    }

    const buffer = await fs.promises.readFile(resolved);
    const mimeType = mime.getType(resolved) || "application/octet-stream";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return { dataUrl, mimeType, size: buffer.length };
  });

  ipcMain.handle("point-image-exists", async (event, request) => {
    const resolved = resolveRequest(request);
    if (!resolved) return { exists: false, size: 0 };

    try {
      const stats = await fs.promises.stat(resolved);
      return { exists: stats.isFile() && stats.size > 0, size: stats.size };
    } catch {
      return { exists: false, size: 0 };
    }
  });

  ipcMain.handle("delete-point-image", async (event, request) => {
    const resolved = resolveRequest(request);
    if (!resolved) {
      return { success: false, reason: "No file path provided" };
    }
    try {
      if (fs.existsSync(resolved)) {
        await fs.promises.unlink(resolved);
      }
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to delete image:", error);
      return { success: false, reason: String(error) };
    }
  });
```

Add `import path from "path";` if it is not already present.

- [ ] **Step 3: Update the preload signatures**

In `electron/preload.cjs`, these three entries pass their argument straight through, so they already support both shapes. Update only the comment-free call for clarity — no code change is required, but confirm the three lines read:

```js
  deletePointImage: (request) => ipcRenderer.invoke("delete-point-image", request),
  pointImageToDataURL: (request) =>
    ipcRenderer.invoke("point-image-to-dataurl", request),
  pointImageExists: (request) =>
    ipcRenderer.invoke("point-image-exists", request),
```

- [ ] **Step 4: Update the TypeScript declarations**

In `src/types.ts`, inside `Window.electron`:

```ts
      registerPointImagePath: (payload: {
        filePath: string;
        timestamp?: number;
        vluchtnummer?: string;
        pointId?: number;
      }) => Promise<{
        filePath: string;
        relPath: string | null;
        fileUrl: string;
        mimeType: string;
        size: number;
        timestamp: number;
      }>;
      pointImageToDataURL?: (
        request:
          | string
          | { image: PointImage; vluchtnummer?: string }
      ) => Promise<{ dataUrl: string; mimeType: string; size: number }>;
      pointImageExists?: (
        request:
          | string
          | { image: PointImage; vluchtnummer?: string }
      ) => Promise<{ exists: boolean; size: number }>;
```

and add to `PointImage`:

```ts
  /** Path relative to the plan folder. Preferred over filePath. */
  relPath?: string | null;
```

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add electron/helpers/imageStorage.js electron/preload.cjs src/types.ts
git commit -m "feature: copy point photos into the plan folder (W-01)"
```

---

### Task 3: Pass plan context from every capture site

A copy cannot happen without the `vluchtnummer` and point id, so every caller of `registerPointImagePath` must supply them.

**Files:**
- Modify: `LIS-Desktop/src/hooks/useHandleAddNewPoint.ts`
- Modify: every other caller found in Step 1

**Interfaces:**
- Consumes: `registerPointImagePath` from Task 2
- Produces: `PointImage` objects carrying `relPath`

- [ ] **Step 1: Find every call site**

```bash
grep -rn "registerPointImagePath" src/
```

Expect `src/hooks/useHandleAddNewPoint.ts` plus any image-attach control under `src/Components/Main/Left/Offline/SelectedPointForm/`.

- [ ] **Step 2: Update `useHandleAddNewPoint.ts`**

The new point's id is computed as `newPointId` before the image block. Pass it and the flight number:

```ts
            const saved =
              (await window.electron?.registerPointImagePath?.({
                filePath: imagePath,
                timestamp: Date.now(),
                vluchtnummer: selectedPlan.vluchtnummer,
                pointId: newPointId,
              })) ?? null;

            if (saved) {
              persistedImages = [
                {
                  filePath: saved.filePath,
                  relPath: saved.relPath,
                  fileUrl: saved.fileUrl,
                  mimeType: saved.mimeType,
                  size: saved.size,
                  timestamp: saved.timestamp ?? Date.now(),
                },
              ];
            }
```

- [ ] **Step 3: Update the remaining call sites the same way**

For each site found in Step 1, add `vluchtnummer: selectedPlan.vluchtnummer` and the id of the point being edited, and copy `relPath` into the stored `PointImage`.

- [ ] **Step 4: Point the upload preflight at the resolved path**

In `.../UploadFlightPlan/FirstModal/hooks/useProcessPlan.ts`, the preflight callback added in Batch 1 must now resolve through the plan folder. Replace it with:

```ts
      const preflight = await preflightPointImages(
        plan.points ?? [],
        async (_filePath: string, image) => {
          const result = await window.electron?.pointImageExists?.({
            image,
            vluchtnummer: plan.vluchtnummer,
          });
          return Boolean(result?.exists);
        }
      );
```

and widen the callback type in `uploadPreflight.ts`:

```ts
  isReadable: (
    filePath: string,
    image: { filePath?: string | null; relPath?: string | null }
  ) => Promise<boolean>
```

passing `image` at the call site inside `preflightPointImages`:

```ts
      if (!(await readable(filePath, image))) {
```

and threading it through the memoised `readable` helper:

```ts
  const readable = async (filePath, image) => {
    const cached = cache.get(filePath);
    if (cached !== undefined) return cached;

    let ok = false;
    try {
      ok = await isReadable(filePath, image);
    } catch {
      ok = false;
    }

    cache.set(filePath, ok);
    return ok;
  };
```

- [ ] **Step 5: Update the preflight tests for the new signature**

In `uploadPreflight.test.ts`, the fakes now receive a second argument. They can ignore it — `const allReadable = async () => true;` still type-checks — but add one test proving the image object is forwarded:

```ts
  it("forwards the image object so the caller can resolve relPath", async () => {
    const seen: unknown[] = [];
    const isReadable = async (_p: string, image: unknown) => {
      seen.push(image);
      return true;
    };
    await preflightPointImages(
      [{ id: 1, images: [{ filePath: "a.jpg", relPath: "images/1-2.jpg" }] }],
      isReadable
    );
    expect(seen).toEqual([{ filePath: "a.jpg", relPath: "images/1-2.jpg" }]);
  });
```

- [ ] **Step 6: Run the tests**

```bash
npm test -- uploadPreflight
```

Expected: PASS, 10 tests.

- [ ] **Step 7: Point the ArcGIS upload at the resolved path**

In `.../hooks/useUploadAttachmentsForPoint.ts`, both the pre-validation loop and the read inside the upload loop call `pointImageToDataURL(image.filePath!)`. Change both to:

```ts
        const dataUrlResponse = await window.electron?.pointImageToDataURL?.({
          image,
          vluchtnummer,
        });
```

`vluchtnummer` must be threaded in — add it as a parameter to `uploadAttachmentsForPoint(pointId, images, vluchtnummer)` and pass `plan.vluchtnummer` from `useProcessPlan`.

- [ ] **Step 8: Verify it compiles and run everything**

```bash
npx tsc -b --noEmit && npm test && npm run test:electron
```

Expected: clean, all pass.

- [ ] **Step 9: Commit**

```bash
git add src/hooks/useHandleAddNewPoint.ts "src/Components/Main/Left/" 
git commit -m "feature: attach photos with plan context and resolve on read"
```

---

### Task 4: Make the watcher the source of truth for the latest photo (W-12)

`get-latest-image-path` scans a shared, never-cleared folder and picks the newest mtime. Over a multi-hour session that can hand back the wrong file.

**Files:**
- Modify: `LIS-Desktop/electron/images-logic/imageWatcher.js`
- Modify: `LIS-Desktop/electron/images-logic/latestImage.js`
- Modify: `LIS-Desktop/electron/main.js`

**Interfaces:**
- Consumes: nothing
- Produces: `recordLatestImage(filePath: string): void` and `getRecordedLatestImage(maxAgeMs: number): string | null` exported from `imageWatcher.js`

- [ ] **Step 1: Record additions in the watcher**

In `electron/images-logic/imageWatcher.js`, above `picturesFolderTrigger`:

```js
let latest = null;

export function recordLatestImage(filePath) {
  latest = { filePath, at: Date.now() };
}

/**
 * The most recently observed new photo, or null if none arrived within
 * maxAgeMs. A stale file must never be silently attached to a new point.
 */
export function getRecordedLatestImage(maxAgeMs = 120000) {
  if (!latest) return null;
  if (Date.now() - latest.at > maxAgeMs) return null;
  return latest.filePath;
}
```

and inside the `watcher.on("add", …)` handler, as the first statement after the guard:

```js
      recordLatestImage(filePath);
```

- [ ] **Step 2: Serve the recorded value**

In `electron/images-logic/latestImage.js`, add the import:

```js
import { getRecordedLatestImage } from "./imageWatcher.js";
```

and replace the body of the `get-latest-image-path` handler with:

```js
  ipcMain.handle("get-latest-image-path", () => {
    // Prefer what the watcher actually saw arrive. The mtime scan below is a
    // fallback for the first photo after a restart, when the watcher has no
    // record yet.
    const recorded = getRecordedLatestImage();
    if (recorded && fs.existsSync(recorded)) return recorded;

    const imagesDir = resolveCameraPath();
    try {
      if (!fs.existsSync(imagesDir)) return null;

      const files = fs.readdirSync(imagesDir);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
      if (imageFiles.length === 0) return null;

      const latestFile = imageFiles.reduce(
        (latest, file) => {
          const filePath = path.join(imagesDir, file);
          const stats = fs.statSync(filePath);
          return stats.mtime > latest.mtime
            ? { file, mtime: stats.mtime, filePath }
            : latest;
        },
        { file: "", mtime: new Date(0), filePath: "" }
      );

      return latestFile.filePath || null;
    } catch (error) {
      console.error("Error accessing images directory:", error);
      return null;
    }
  });
```

- [ ] **Step 3: Confirm the watcher starts before the window**

In `electron/main.js`, `picturesFolderTrigger(win)` currently runs *after* `createWindow()`. That is fine — the watcher only needs to be running before the operator attaches a photo — but confirm it is not inside a conditional that could skip it.

- [ ] **Step 4: Verify manually**

```bash
npm run dev
```

Copy two images into `%USERPROFILE%\Pictures\Lis` several seconds apart, then attach a photo to a new point. Expected: the second image is used. Wait more than two minutes with no new photo and attach again — expected: it falls back to the mtime scan rather than reusing the stale record.

- [ ] **Step 5: Commit**

```bash
git add electron/images-logic/imageWatcher.js electron/images-logic/latestImage.js
git commit -m "fix: use the watcher rather than an mtime scan for the latest photo (W-12)"
```

---

### Task 5: Stamp the schema version and clean up on delete

**Files:**
- Modify: `LIS-Desktop/electron/helpers/saveJSON.js`

**Interfaces:**
- Consumes: `migratePlan`, `CURRENT_SCHEMA_VERSION` (Task 1)
- Produces: every plan written carries `schemaVersion: 2`; every plan read is migrated before it leaves the main process

- [ ] **Step 1: Migrate on read**

In `saveJSON.js`, add:

```js
import { CURRENT_SCHEMA_VERSION, migratePlan } from "./planSchema.js";
```

In the `getCurrentPlan` handler, replace the return with:

```js
      const plan = readJsonSafe(flightPlanPath, null);
      return migratePlan(plan);
```

In the `listAllPlans` handler, replace the push with:

```js
              const plan = migratePlan(readJsonSafe(flightPlanPath, null));
              if (plan && plan.vluchtnummer) {
                plans.push(plan);
              }
```

- [ ] **Step 2: Stamp on write**

In both `saveDataAsJson` and `saveCurrentPlan`, change the merged value written to disk:

```js
      const mergedPlan = mergeDeep(existingPlan, flightPlan);
      updateJSONInPlace(flightPlanPath, {
        ...mergedPlan,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      });
```

- [ ] **Step 3: Confirm `deletePlan` removes the images**

`deletePlan` already does `fs.rmSync(folder, { recursive: true, force: true })`, which takes `images/` with it. Read it and confirm — no change expected.

- [ ] **Step 4: Verify round-trip**

```bash
npm run dev
```

Open a plan, add a point with a photo. Then inspect:

```powershell
Get-Content "C:\lis-temp-data\<vluchtnummer>\flightPlan.json" | Select-String "schemaVersion|relPath"
Get-ChildItem "C:\lis-temp-data\<vluchtnummer>\images"
```

Expected: `"schemaVersion": 2`, a `relPath` on the image, and the copied file present.

- [ ] **Step 5: Commit**

```bash
git add electron/helpers/saveJSON.js
git commit -m "feature: stamp and migrate plan schema version on read and write"
```

---

### Task 6: Prove the original failure is fixed

**Files:** none modified (verification only).

- [ ] **Step 1: Create a plan with photos and press Verstuur**

```bash
npm run dev
```

Attach at least two photos across two points, then Verstuur.

- [ ] **Step 2: Destroy the camera folder — the W-01 scenario**

```powershell
Remove-Item "$([Environment]::GetFolderPath('MyPictures'))\Lis\*" -Force
```

- [ ] **Step 3: Upload**

Log in, upload the plan.

Expected: **the upload succeeds with every photo intact.** Before this batch it would have been blocked by Batch 1 (or, before that, silently succeeded with no imagery).

- [ ] **Step 4: Confirm on the website**

Open the finished plan in LIS web and confirm the images render for both points.

- [ ] **Step 5: Verify a legacy v1 plan still works**

Hand-craft one by removing the new fields from a saved plan:

```powershell
$p = "C:\lis-temp-data\<vluchtnummer>\flightPlan.json"
(Get-Content $p -Raw) -replace '"schemaVersion": 2,','' -replace '"relPath": "[^"]*",','' |
  Set-Content $p -Encoding utf8
```

Restore the camera folder photos to their original paths, then upload. Expected: succeeds via the `filePath` fallback.

- [ ] **Step 6: Record the result**

Append a `## Verification log` section to this file with the date, app version, and the outcome of Steps 3 and 5.

- [ ] **Step 7: Commit**

```bash
git add ../LIS/planning/batch-3-image-lifecycle.md
git commit -m "planning: record batch 3 verification"
```

---

## Done when

- [ ] `npm test` and `npm run test:electron` pass (30 node tests, 13 vitest)
- [ ] A photo attached to a point appears under `<plan folder>/images/` immediately
- [ ] Wiping `Pictures\Lis` after Verstuur no longer affects the upload
- [ ] A v1 plan with no `relPath` still uploads via the `filePath` fallback
- [ ] `deletePlan` removes the copied images with the folder
- [ ] The latest-photo lookup uses the watcher record, and refuses stale records
- [ ] `npx tsc -b --noEmit` is clean
