# Batch 2 — Filesystem Robustness (W-05, W-08, W-09) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop flight plans silently disappearing before upload is ever attempted — by making the folder lookup consistent with the folder write, making JSON writes atomic, and making a failed save visible to the operator mid-flight.

**Architecture:** `electron/helpers/saveJSON.js` mixes pure path/JSON logic with `ipcMain` registration, so none of it can be unit-tested today. Task 1 extracts the pure half into `electron/helpers/planFiles.js` — the same shape as `desktopLoginUrl.js`, which is already tested with `node --test`. The three fixes then land as small, tested changes to that pure module, plus one UI change for the operator-visible part.

**Tech Stack:** Electron 28 (ESM main process), `node:test` + `node:assert/strict`, React 19 + Zustand 5, Vitest 3 (added in Batch 1).

**Spec:** `../../lis-upload-weaknesses.html` (findings W-05, W-08, W-09)

## Global Constraints

- **Repo:** `LIS-Desktop` only.
- **Depends on Batch 1 Task 1** for Vitest (used in Task 6 only). Tasks 1–5 need only `node --test`, which already works.
- **No on-disk schema change.** See `SPEC-plan-json-schema.md`; v2 arrives in Batch 3. This batch changes *how* the file is written, never *what* is in it.
- **`mergeDeep` semantics must not change.** It replaces arrays wholesale, which is required so a shrinking `points`/`images` array does not resurrect removed entries.
- **Base directory stays `C:/lis-temp-data`.** Do not make it configurable in this batch — that widens the blast radius for no benefit here.
- **User-facing strings are Dutch.**
- Batch 3 depends on this batch: it writes image files next to the plan JSON and relies on `planFiles.js` and the atomic write.

## File Structure

| File | Responsibility |
|---|---|
| `electron/helpers/planFiles.js` *(new)* | **Pure.** Path resolution, sanitisation, atomic JSON read/write, deep merge. No `electron` import |
| `electron/helpers/planFiles.test.mjs` *(new)* | `node --test` suite for the above |
| `electron/helpers/saveJSON.js` | IPC registration only; delegates all logic to `planFiles.js` |
| `src/helpers/zustand/useSaveHealth.ts` *(new)* | Tracks whether local persistence is currently working |
| `src/helpers/zustand/useSaveHealth.test.ts` *(new)* | Vitest suite for the store's transitions |
| `src/hooks/backUp/useBackUpData.ts` | Reports save failures instead of swallowing them |
| `src/hooks/backUp/useSaveAsJson.ts` | Same, for the 30-second autosave |
| `src/Components/Main/Left/index.tsx` | Renders the persistent failure banner |

---

### Task 1: Extract the pure filesystem helpers

No behaviour change. This task exists so the next four tasks can be test-driven.

**Files:**
- Create: `LIS-Desktop/electron/helpers/planFiles.js`
- Create: `LIS-Desktop/electron/helpers/planFiles.test.mjs`
- Modify: `LIS-Desktop/electron/helpers/saveJSON.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `BASE_DIR: string` (`"C:/lis-temp-data"`)
  - `sanitizeName(input: unknown): string`
  - `resolveFolder(baseDir: string, vlucht: unknown): string`
  - `findFolderByVlucht(baseDir: string, vlucht: unknown): string | null`
  - `ensureDir(p: string): void`
  - `readJsonSafe(filePath: string, fallback: any): any`
  - `updateJSONInPlace(filePath: string, value: any): void`
  - `mergeDeep(target: any, source: any): any`

- [ ] **Step 1: Write the characterisation tests**

These lock in today's behaviour, including the bug in `findFolderByVlucht`, so that Task 2's change is visibly a change.

Create `LIS-Desktop/electron/helpers/planFiles.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  mergeDeep,
  readJsonSafe,
  resolveFolder,
  sanitizeName,
  updateJSONInPlace,
} from "./planFiles.js";

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "lis-planfiles-"));
}

test("sanitizeName replaces whitespace and reserved characters", () => {
  assert.equal(sanitizeName("RWS-2026-014"), "RWS-2026-014");
  assert.equal(sanitizeName("  A 12  "), "A-12");
  assert.equal(sanitizeName('a<b>c:d"e/f\\g|h?i*j'), "a-b-c-d-e-f-g-h-i-j");
  assert.equal(sanitizeName(123), "123");
});

test("resolveFolder joins the sanitised name onto the base", () => {
  const folder = resolveFolder("C:/base", "A 12");
  assert.equal(path.basename(folder), "A-12");
});

test("readJsonSafe returns the fallback for missing, empty and corrupt files", () => {
  const dir = tmpDir();
  const missing = path.join(dir, "nope.json");
  assert.deepEqual(readJsonSafe(missing, { a: 1 }), { a: 1 });

  const empty = path.join(dir, "empty.json");
  fs.writeFileSync(empty, "   ", "utf-8");
  assert.deepEqual(readJsonSafe(empty, { b: 2 }), { b: 2 });

  const corrupt = path.join(dir, "corrupt.json");
  fs.writeFileSync(corrupt, '{"half": ', "utf-8");
  assert.deepEqual(readJsonSafe(corrupt, { c: 3 }), { c: 3 });
});

test("readJsonSafe round-trips a valid file", () => {
  const dir = tmpDir();
  const file = path.join(dir, "plan.json");
  updateJSONInPlace(file, { id: 7, points: [1, 2] });
  assert.deepEqual(readJsonSafe(file, null), { id: 7, points: [1, 2] });
});

test("mergeDeep replaces arrays wholesale rather than merging elementwise", () => {
  const merged = mergeDeep({ points: [1, 2, 3], keep: "yes" }, { points: [9] });
  assert.deepEqual(merged.points, [9]);
  assert.equal(merged.keep, "yes");
});

test("mergeDeep recurses into plain objects", () => {
  const merged = mergeDeep(
    { a: { b: 1, c: 2 } },
    { a: { c: 3, d: 4 } }
  );
  assert.deepEqual(merged, { a: { b: 1, c: 3, d: 4 } });
});

test("mergeDeep returns the source when either side is not an object", () => {
  assert.equal(mergeDeep(null, 5), 5);
  assert.equal(mergeDeep({ a: 1 }, null), null);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd LIS-Desktop
node --test electron/helpers/planFiles.test.mjs
```

Expected: FAIL — `Cannot find module './planFiles.js'`.

- [ ] **Step 3: Create the module by moving the functions verbatim**

Create `LIS-Desktop/electron/helpers/planFiles.js`. These bodies are copied unchanged from `saveJSON.js` — this task must not alter behaviour.

```js
/**
 * Pure filesystem helpers for the on-disk plan folder.
 *
 * Deliberately free of any `electron` import so it can be unit-tested with
 * `node --test`, following the same pattern as desktopLoginUrl.js.
 */
import fs from "fs";
import path from "path";

export const BASE_DIR = "C:/lis-temp-data";

export function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw.trim() ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function updateJSONInPlace(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

export function mergeDeep(target, source) {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return source;

  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    const sVal = source[key];
    const tVal = out[key];
    if (Array.isArray(sVal)) {
      out[key] = [...sVal];
    } else if (sVal && typeof sVal === "object" && !Array.isArray(sVal)) {
      out[key] = mergeDeep(tVal && typeof tVal === "object" ? tVal : {}, sVal);
    } else {
      out[key] = sVal;
    }
  }
  return out;
}

export function sanitizeName(s) {
  return String(s)
    .trim()
    .replace(/[<>:"/\\|?*\s]+/g, "-");
}

export function resolveFolder(baseDir, vlucht) {
  const safeVlucht = sanitizeName(vlucht);
  const folderName = `${safeVlucht}`;
  return path.join(baseDir, folderName);
}

export function findFolderByVlucht(baseDir, vlucht) {
  const target = `${vlucht}`;
  if (!fs.existsSync(baseDir)) return null;
  const match = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .find((d) => d.isDirectory() && d.name === target);
  return match ? path.join(baseDir, target) : null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Make `saveJSON.js` delegate**

In `LIS-Desktop/electron/helpers/saveJSON.js`, delete the local definitions of `ensureDir`, `readJsonSafe`, `updateJSONInPlace`, `mergeDeep`, `sanitizeName`, `resolveFolder` and `findFolderByVlucht`, and replace the imports at the top with:

```js
import { ipcMain } from "electron";
import path from "path";
import {
  BASE_DIR,
  ensureDir,
  findFolderByVlucht,
  mergeDeep,
  readJsonSafe,
  resolveFolder,
  updateJSONInPlace,
} from "./planFiles.js";
```

Then replace every occurrence of `const baseDir = "C:/lis-temp-data";` in the seven handlers with `const baseDir = BASE_DIR;`. The `fs` import is still needed by `deletePlan` (`fs.rmSync`) and `getJsonFile` (`fs.existsSync`), so keep it.

- [ ] **Step 6: Verify the app still saves and loads a plan**

```bash
npm run dev
```

Open a plan, add a point, confirm `C:/lis-temp-data/<vluchtnummer>/flightPlan.json` updates. Close and reopen the app; confirm the plan still appears under **Opgeslagen vluchtplannen**.

- [ ] **Step 7: Commit**

```bash
git add electron/helpers/planFiles.js electron/helpers/planFiles.test.mjs electron/helpers/saveJSON.js
git commit -m "refactor: extract pure plan-folder helpers into planFiles.js"
```

---

### Task 2: Fix the sanitise mismatch (W-05)

Writes go to the sanitised folder name; reads look up the raw one. Any `vluchtnummer` containing a space or a reserved character is written to a folder that can never be found again — `getCurrentPlan` returns `null` (the plan silently vanishes from the upload list) and `getJsonFile` throws (the upload aborts).

**Files:**
- Modify: `LIS-Desktop/electron/helpers/planFiles.js`
- Modify: `LIS-Desktop/electron/helpers/planFiles.test.mjs`

**Interfaces:**
- Consumes: `sanitizeName` from Task 1
- Produces: `findFolderByVlucht` matches sanitised-for-sanitised, and still finds a legacy folder stored under the raw name

- [ ] **Step 1: Write the failing tests**

Append to `planFiles.test.mjs`:

```js
import { findFolderByVlucht } from "./planFiles.js";

test("findFolderByVlucht finds a folder written under the sanitised name", () => {
  const base = tmpDir();
  fs.mkdirSync(path.join(base, "A-12-B"));

  // The caller passes the raw vluchtnummer; the folder on disk is sanitised.
  const found = findFolderByVlucht(base, "A 12 B");
  assert.equal(found, path.join(base, "A-12-B"));
});

test("findFolderByVlucht still finds an exact-match folder", () => {
  const base = tmpDir();
  fs.mkdirSync(path.join(base, "RWS-2026-014"));
  assert.equal(
    findFolderByVlucht(base, "RWS-2026-014"),
    path.join(base, "RWS-2026-014")
  );
});

test("findFolderByVlucht finds a legacy folder stored under the raw name", () => {
  const base = tmpDir();
  // Written by an older build that used the raw name.
  fs.mkdirSync(path.join(base, "A 12 B"));
  assert.equal(findFolderByVlucht(base, "A 12 B"), path.join(base, "A 12 B"));
});

test("findFolderByVlucht returns null for an unknown flight and a missing base", () => {
  const base = tmpDir();
  assert.equal(findFolderByVlucht(base, "nope"), null);
  assert.equal(findFolderByVlucht(path.join(base, "gone"), "x"), null);
});
```

- [ ] **Step 2: Run to verify the first test fails**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: FAIL on *"finds a folder written under the sanitised name"* — it returns `null` today.

- [ ] **Step 3: Fix the lookup**

Replace `findFolderByVlucht` in `planFiles.js`:

```js
export function findFolderByVlucht(baseDir, vlucht) {
  if (!fs.existsSync(baseDir)) return null;

  const raw = `${vlucht}`;
  const sanitised = sanitizeName(vlucht);

  const dirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  // Prefer the canonical (sanitised) name, then fall back to an exact raw
  // match so folders written by older builds stay reachable.
  const match =
    dirs.find((name) => name === sanitised) ??
    dirs.find((name) => name === raw) ??
    null;

  return match ? path.join(baseDir, match) : null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add electron/helpers/planFiles.js electron/helpers/planFiles.test.mjs
git commit -m "fix: resolve plan folder by sanitised name (W-05)"
```

---

### Task 3: Make JSON writes atomic (W-08)

`updateJSONInPlace` is a bare `writeFileSync`, called on every plan state change and every GPS point for hours. A crash or power loss mid-write truncates the file; `readJsonSafe` then swallows the parse error and the plan silently disappears.

**Files:**
- Modify: `LIS-Desktop/electron/helpers/planFiles.js`
- Modify: `LIS-Desktop/electron/helpers/planFiles.test.mjs`

**Interfaces:**
- Consumes: nothing new
- Produces: `updateJSONInPlace` writes via a temp file and `renameSync`, and leaves a `.bak` alongside; `readJsonSafe` falls back to the `.bak` before the caller's fallback

- [ ] **Step 1: Write the failing tests**

Append to `planFiles.test.mjs`:

```js
test("updateJSONInPlace leaves no temp file behind", () => {
  const dir = tmpDir();
  const file = path.join(dir, "plan.json");
  updateJSONInPlace(file, { id: 1 });
  const left = fs.readdirSync(dir).filter((n) => n.endsWith(".tmp"));
  assert.deepEqual(left, []);
});

test("updateJSONInPlace keeps the previous content as a .bak", () => {
  const dir = tmpDir();
  const file = path.join(dir, "plan.json");
  updateJSONInPlace(file, { id: 1 });
  updateJSONInPlace(file, { id: 2 });

  assert.deepEqual(readJsonSafe(file, null), { id: 2 });
  assert.deepEqual(readJsonSafe(`${file}.bak`, null), { id: 1 });
});

test("readJsonSafe recovers from the backup when the primary is corrupt", () => {
  const dir = tmpDir();
  const file = path.join(dir, "plan.json");
  updateJSONInPlace(file, { id: 1, points: [1] });
  updateJSONInPlace(file, { id: 2, points: [1, 2] });

  // Simulate a crash during the next write.
  fs.writeFileSync(file, '{"id": 3, "poin', "utf-8");

  assert.deepEqual(readJsonSafe(file, null), { id: 1, points: [1] });
});

test("readJsonSafe uses the caller fallback when both files are unusable", () => {
  const dir = tmpDir();
  const file = path.join(dir, "plan.json");
  fs.writeFileSync(file, "{oops", "utf-8");
  fs.writeFileSync(`${file}.bak`, "{also oops", "utf-8");
  assert.deepEqual(readJsonSafe(file, { fallback: true }), { fallback: true });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: FAIL on the `.bak` and recovery tests.

- [ ] **Step 3: Implement the atomic write and backup read**

Replace both functions in `planFiles.js`:

```js
/**
 * Atomic write: a reader always sees either the previous file or the new one,
 * never a truncated one. The device is offline for hours and can lose power
 * mid-flight, and this function runs on every plan state change.
 */
export function updateJSONInPlace(filePath, value) {
  const tmp = `${filePath}.tmp`;
  const bak = `${filePath}.bak`;
  const serialised = JSON.stringify(value, null, 2);

  fs.writeFileSync(tmp, serialised, "utf-8");

  // Keep the previous good copy before swapping the new one in.
  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, bak);
    }
  } catch {
    // A failed backup must not block the write itself.
  }

  fs.renameSync(tmp, filePath);
}

export function readJsonSafe(filePath, fallback) {
  const parse = (candidate) => {
    if (!fs.existsSync(candidate)) return undefined;
    const raw = fs.readFileSync(candidate, "utf-8");
    if (!raw.trim()) return undefined;
    return JSON.parse(raw);
  };

  try {
    const primary = parse(filePath);
    if (primary !== undefined) return primary;
  } catch {
    // Fall through to the backup — a truncated primary is exactly the case
    // the .bak exists for.
  }

  try {
    const backup = parse(`${filePath}.bak`);
    if (backup !== undefined) return backup;
  } catch {
    // Both unusable.
  }

  return fallback;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: PASS, 15 tests.

- [ ] **Step 5: Confirm `deletePlan` still removes everything**

`deletePlan` uses `fs.rmSync(folder, { recursive: true, force: true })`, which removes `.bak` and `.tmp` files too. Read the handler in `saveJSON.js` and confirm — no change expected.

- [ ] **Step 6: Commit**

```bash
git add electron/helpers/planFiles.js electron/helpers/planFiles.test.mjs
git commit -m "fix: atomic plan JSON writes with backup recovery (W-08)"
```

---

### Task 4: Migrate legacy raw-named folders

Task 2 made the lookup tolerant of legacy folders. This task normalises them so there is exactly one canonical folder per flight, which Batch 3 depends on when it writes `images/` into the plan folder.

**Files:**
- Modify: `LIS-Desktop/electron/helpers/planFiles.js`
- Modify: `LIS-Desktop/electron/helpers/planFiles.test.mjs`
- Modify: `LIS-Desktop/electron/main.js`

**Interfaces:**
- Consumes: `sanitizeName`, `BASE_DIR`
- Produces: `migrateLegacyFolders(baseDir: string): { renamed: string[]; skipped: string[] }`

- [ ] **Step 1: Write the failing tests**

Append to `planFiles.test.mjs`:

```js
import { migrateLegacyFolders } from "./planFiles.js";

test("migrateLegacyFolders renames folders whose name is not sanitised", () => {
  const base = tmpDir();
  fs.mkdirSync(path.join(base, "A 12 B"));
  fs.writeFileSync(path.join(base, "A 12 B", "flightPlan.json"), "{}", "utf-8");

  const result = migrateLegacyFolders(base);

  assert.deepEqual(result.renamed, ["A 12 B"]);
  assert.equal(fs.existsSync(path.join(base, "A-12-B", "flightPlan.json")), true);
  assert.equal(fs.existsSync(path.join(base, "A 12 B")), false);
});

test("migrateLegacyFolders leaves already-canonical folders alone", () => {
  const base = tmpDir();
  fs.mkdirSync(path.join(base, "RWS-2026-014"));
  const result = migrateLegacyFolders(base);
  assert.deepEqual(result.renamed, []);
  assert.deepEqual(result.skipped, []);
});

test("migrateLegacyFolders skips rather than clobbers when the target exists", () => {
  const base = tmpDir();
  fs.mkdirSync(path.join(base, "A 12"));
  fs.mkdirSync(path.join(base, "A-12"));
  fs.writeFileSync(path.join(base, "A-12", "keep.json"), "{}", "utf-8");

  const result = migrateLegacyFolders(base);

  assert.deepEqual(result.renamed, []);
  assert.deepEqual(result.skipped, ["A 12"]);
  assert.equal(fs.existsSync(path.join(base, "A-12", "keep.json")), true);
  assert.equal(fs.existsSync(path.join(base, "A 12")), true);
});

test("migrateLegacyFolders tolerates a missing base directory", () => {
  const result = migrateLegacyFolders(path.join(tmpDir(), "absent"));
  assert.deepEqual(result, { renamed: [], skipped: [] });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: FAIL — `migrateLegacyFolders is not a function`.

- [ ] **Step 3: Implement it**

Append to `planFiles.js`:

```js
/**
 * Renames plan folders written by older builds under the raw vluchtnummer to
 * the canonical sanitised name. Never clobbers: if the canonical folder already
 * exists, the legacy one is left alone and reported as skipped for manual
 * review — a plan folder may hold the only copy of a flight.
 */
export function migrateLegacyFolders(baseDir) {
  const renamed = [];
  const skipped = [];

  if (!fs.existsSync(baseDir)) return { renamed, skipped };

  const dirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const name of dirs) {
    const canonical = sanitizeName(name);
    if (canonical === name) continue;

    const from = path.join(baseDir, name);
    const to = path.join(baseDir, canonical);

    if (fs.existsSync(to)) {
      skipped.push(name);
      continue;
    }

    try {
      fs.renameSync(from, to);
      renamed.push(name);
    } catch {
      skipped.push(name);
    }
  }

  return { renamed, skipped };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test electron/helpers/planFiles.test.mjs
```

Expected: PASS, 19 tests.

- [ ] **Step 5: Run it once at startup**

In `LIS-Desktop/electron/main.js`, add to the imports:

```js
import { BASE_DIR, migrateLegacyFolders } from "./helpers/planFiles.js";
```

and inside `app.whenReady().then(async () => { … })`, immediately before `win = createWindow();`:

```js
  // Normalise plan folders written by older builds under the raw vluchtnummer.
  try {
    const migration = migrateLegacyFolders(BASE_DIR);
    if (migration.renamed.length || migration.skipped.length) {
      console.log("[main] plan folder migration:", migration);
    }
  } catch (e) {
    console.error("[main] Failed to migrate plan folders:", e);
  }
```

- [ ] **Step 6: Verify against a seeded legacy folder**

```powershell
New-Item -ItemType Directory "C:\lis-temp-data\TEST 99" -Force
'{}' | Out-File -Encoding utf8 "C:\lis-temp-data\TEST 99\flightPlan.json"
```

```bash
npm run dev
```

Expected in the terminal: `[main] plan folder migration: { renamed: [ 'TEST 99' ], skipped: [] }`, and `C:\lis-temp-data\TEST-99\` now exists.

- [ ] **Step 7: Commit**

```bash
git add electron/helpers/planFiles.js electron/helpers/planFiles.test.mjs electron/main.js
git commit -m "feature: migrate legacy raw-named plan folders on startup"
```

---

### Task 5: Track save health in a store

**Files:**
- Create: `LIS-Desktop/src/helpers/zustand/useSaveHealth.ts`
- Create: `LIS-Desktop/src/helpers/zustand/useSaveHealth.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type SaveHealth = "ok" | "failing"`
  - `useSaveHealth` — Zustand store with `{ status: SaveHealth; lastError: string | null; failedAt: number | null; reportSaveFailure(message: string): void; reportSaveSuccess(): void }`

- [ ] **Step 1: Write the failing tests**

Create `src/helpers/zustand/useSaveHealth.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useSaveHealth } from "./useSaveHealth";

describe("useSaveHealth", () => {
  beforeEach(() => {
    useSaveHealth.getState().reportSaveSuccess();
  });

  it("starts healthy", () => {
    expect(useSaveHealth.getState().status).toBe("ok");
    expect(useSaveHealth.getState().lastError).toBeNull();
  });

  it("records a failure with its message", () => {
    useSaveHealth.getState().reportSaveFailure("ENOSPC: no space left");
    const state = useSaveHealth.getState();
    expect(state.status).toBe("failing");
    expect(state.lastError).toBe("ENOSPC: no space left");
    expect(typeof state.failedAt).toBe("number");
  });

  it("clears only after a subsequent success", () => {
    useSaveHealth.getState().reportSaveFailure("disk gone");
    expect(useSaveHealth.getState().status).toBe("failing");

    useSaveHealth.getState().reportSaveFailure("still gone");
    expect(useSaveHealth.getState().status).toBe("failing");
    expect(useSaveHealth.getState().lastError).toBe("still gone");

    useSaveHealth.getState().reportSaveSuccess();
    expect(useSaveHealth.getState().status).toBe("ok");
    expect(useSaveHealth.getState().lastError).toBeNull();
    expect(useSaveHealth.getState().failedAt).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- useSaveHealth
```

Expected: FAIL — cannot resolve `./useSaveHealth`.

- [ ] **Step 3: Implement the store**

Create `src/helpers/zustand/useSaveHealth.ts`:

```ts
import { create } from "zustand";

export type SaveHealth = "ok" | "failing";

/**
 * Whether writing the flight plan to disk is currently working.
 *
 * The operator flies offline for hours; if the disk fills or OneDrive locks the
 * file, a console error is invisible to them and they keep working against
 * state that is no longer being persisted (W-09).
 */
export const useSaveHealth = create<{
  status: SaveHealth;
  lastError: string | null;
  failedAt: number | null;
  reportSaveFailure: (message: string) => void;
  reportSaveSuccess: () => void;
}>((set) => ({
  status: "ok",
  lastError: null,
  failedAt: null,

  reportSaveFailure: (message) =>
    set({ status: "failing", lastError: message, failedAt: Date.now() }),

  // Only a successful write clears the warning — it must survive until the
  // underlying problem is actually fixed.
  reportSaveSuccess: () =>
    set({ status: "ok", lastError: null, failedAt: null }),
}));
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test -- useSaveHealth
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/helpers/zustand/useSaveHealth.ts src/helpers/zustand/useSaveHealth.test.ts
git commit -m "feature: add save-health store for local persistence failures"
```

---

### Task 6: Report save failures to the operator (W-09)

**Files:**
- Modify: `LIS-Desktop/src/hooks/backUp/useBackUpData.ts`
- Modify: `LIS-Desktop/src/hooks/backUp/useSaveAsJson.ts`
- Modify: `LIS-Desktop/src/Components/Main/Left/index.tsx`

**Interfaces:**
- Consumes: `useSaveHealth` from Task 5
- Produces: a persistent banner while `status === "failing"`

- [ ] **Step 1: Report from the plan autosave**

In `src/hooks/backUp/useBackUpData.ts`, add the import:

```ts
import { useSaveHealth } from "@helpers/zustand/useSaveHealth";
```

and inside the hook body, before the effects:

```ts
  const { reportSaveFailure, reportSaveSuccess } = useSaveHealth();
```

Replace the first effect's save call with:

```ts
    window.electron
      ?.saveCurrentPlan?.(selectedPlan)
      .then(() => reportSaveSuccess())
      .catch((error) => {
        console.error("Failed to save current plan:", error);
        reportSaveFailure(
          error instanceof Error ? error.message : String(error)
        );
      });
```

and the timer effect's save call with:

```ts
    window.electron
      ?.saveTimerData?.({
        vluchtnummer: selectedPlan.vluchtnummer,
        timestamps,
      })
      .then(() => reportSaveSuccess())
      .catch((error) => {
        console.error("Failed to save timer data:", error);
        reportSaveFailure(
          error instanceof Error ? error.message : String(error)
        );
      });
```

- [ ] **Step 2: Report from the 30-second autosave**

In `src/hooks/backUp/useSaveAsJson.ts`, add the same import and hook call, then replace the body of the `try` with:

```ts
      const cleanPlan = JSON.parse(JSON.stringify(selectedPlan));
      const currentPlanHash = JSON.stringify(cleanPlan);

      if (currentPlanHash !== lastSavedDataRef.current) {
        await window.electron?.saveDataAsJson(cleanPlan);
        lastSavedDataRef.current = currentPlanHash;
        reportSaveSuccess();
      }
```

and the `catch`:

```ts
    } catch (error) {
      console.error("❌ Error saving JSON:", error);
      reportSaveFailure(
        error instanceof Error ? error.message : String(error)
      );
    }
```

Note `saveAsJson` must now be `async` and the `window.electron?.saveDataAsJson(...)` call must be awaited — without the `await`, a rejected promise never reaches the `catch` and the failure stays invisible, which is the whole bug.

- [ ] **Step 3: Render the banner**

In `src/Components/Main/Left/index.tsx`, add:

```tsx
import { useSaveHealth } from "@helpers/zustand/useSaveHealth";
```

```tsx
  const { status: saveStatus, lastError } = useSaveHealth();
```

and as the first child of the component's outermost element:

```tsx
      {saveStatus === "failing" && (
        <div className="bg-red-700 px-3 py-2 text-sm font-semibold text-white">
          Opslaan mislukt — werk wordt NIET bewaard.
          <span className="block text-xs font-normal opacity-90">
            {lastError ?? "Onbekende fout"}. Controleer de schijfruimte en
            meld dit direct.
          </span>
        </div>
      )}
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 5: Verify the banner appears on a real failure**

```bash
npm run dev
```

Open a plan, then make the folder unwritable:

```powershell
icacls "C:\lis-temp-data\<vluchtnummer>" /deny "$env:USERNAME:(W)"
```

Edit a point in the app. Expected: the red banner appears within a few seconds and stays.

Restore access and edit again:

```powershell
icacls "C:\lis-temp-data\<vluchtnummer>" /remove:d "$env:USERNAME"
```

Expected: the banner clears after the next successful save.

- [ ] **Step 6: Run the full suite**

```bash
npm test && npm run test:electron
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/backUp/useBackUpData.ts src/hooks/backUp/useSaveAsJson.ts "src/Components/Main/Left/index.tsx"
git commit -m "fix: surface local save failures to the operator (W-09)"
```

---

## Done when

- [ ] `npm test` and `npm run test:electron` both pass (19 node tests, 3 vitest)
- [ ] A plan whose `vluchtnummer` contains a space can be saved, listed, and uploaded
- [ ] A legacy raw-named folder is renamed at startup, and a colliding one is skipped rather than clobbered
- [ ] Killing the app mid-write leaves a loadable plan (primary or `.bak`)
- [ ] Making the plan folder unwritable produces a persistent red banner that clears only after a successful save
- [ ] `npx tsc -b --noEmit` is clean
