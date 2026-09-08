# SPEC — on-disk `flightPlan.json` schema

Shared design for the three batches that add fields to the plan file. Designed
once here so the format migrates **once**, not three times.

**Location:** `C:/lis-temp-data/<sanitised vluchtnummer>/flightPlan.json`

**Why this matters:** field devices may hold unuploaded flights across an app
upgrade. A plan written by v1.0.9 must still open, and still upload, under a
later build. Migration is therefore forward-only and lossless.

## v1 — what exists today (implicit, unversioned)

The file is a serialised `FlightPlanType` (`src/types.ts`), deep-merged on every
write by `mergeDeep` in `electron/helpers/saveJSON.js`. There is no version
marker. Relevant shape:

```jsonc
{
  "id": 4321,
  "vluchtnummer": "RWS-2026-014",
  "done": false,
  "points": [
    {
      "id": -1,                        // negative = created in flight
      "omschrijving": "…",
      "state": "done",
      "comment": "…",
      "spoed": 0,
      "finishedAt": 1757068800000,     // added Sep 2026
      "images": [
        {
          "filePath": "C:\\Users\\x\\Pictures\\Lis\\IMG_0042.jpg",  // ABSOLUTE
          "mimeType": "image/jpeg",
          "size": 3145728,
          "timestamp": 1757068790000
        }
      ]
    }
  ],
  "geometries": [ /* … */ ]
}
```

Two properties of v1 that the fixes depend on:

1. `images[].filePath` is an **absolute path into the camera's own folder**
   (`%USERPROFILE%\Pictures\Lis`). The bytes are never copied. This is W-01.
2. There is **no record of what has already been uploaded**, so a retry redoes
   everything. This is W-04.

## v2 — target

Three additions. All are optional-on-read so a v1 file still loads.

```jsonc
{
  "schemaVersion": 2,                  // NEW — absent means v1
  "uploadId": "6f9619ff-8b86-d011-b42d-00c04fc964ff",  // NEW — stable across retries
  "id": 4321,
  "vluchtnummer": "RWS-2026-014",
  "done": true,
  "points": [
    {
      "id": -1,
      "finishedAt": 1757068800000,
      "images": [
        {
          "relPath": "images/-1-1757068790000.jpg",   // NEW — relative to plan folder
          "filePath": "C:\\Users\\x\\Pictures\\Lis\\IMG_0042.jpg", // kept for provenance
          "mimeType": "image/jpeg",
          "size": 3145728,
          "timestamp": 1757068790000
        }
      ],
      "attachments": [                 // NEW — persisted upload checkpoint
        {
          "url": "https://services-eu1.arcgis.com/…/attachments/9",
          "objectId": 118,
          "attachmentId": 9,
          "taken_at": 1757068790000
        }
      ]
    }
  ]
}
```

### Field contracts

| Field | Type | Added by | Meaning |
|---|---|---|---|
| `schemaVersion` | `2` | Batch 3 | Absent or `1` ⇒ legacy file, migrate on read |
| `uploadId` | uuid string | Batch 4 | Generated once when Verstuur runs. **Never regenerated on retry** — that is the whole point |
| `images[].relPath` | string, POSIX separators | Batch 3 | Path relative to the plan folder. Resolve against the folder, never trust `filePath` |
| `points[].attachments` | array | Batch 4 | Present and non-empty ⇒ already in ArcGIS, skip on retry |

### Rules

1. **`relPath` wins.** If `relPath` is present and resolves to an existing file,
   use it. Fall back to `filePath` only when `relPath` is absent (a v1 file whose
   images have not been migrated). Never prefer the absolute path.
2. **`relPath` uses forward slashes** in the file, and is joined with
   `path.join` on read. Windows accepts both; storing POSIX keeps files
   diff-friendly and portable.
3. **`uploadId` is generated at Verstuur, not at upload.** If it were generated
   at upload time, each retry would produce a new one and the server-side replay
   check would never fire.
4. **`attachments` is written incrementally**, after each point's photos land in
   ArcGIS — not once at the end. That is what makes an interrupted upload
   resumable.
5. **`mergeDeep` replaces arrays wholesale** (`out[key] = [...sVal]`). This is
   correct for `points`, `images` and `attachments` — a shrinking array must not
   resurrect removed entries. Do not "improve" it into an element-wise merge.

## Migration

Forward-only, performed on read, persisted on the next write. No separate
migration pass and no rewrite-everything-on-startup step.

```js
// electron/helpers/planSchema.js  — created in Batch 3, Task 1
export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Upgrade a plan object read from disk to the current schema.
 * Pure: no filesystem access, no mutation of the input.
 */
export function migratePlan(plan) {
  if (!plan || typeof plan !== "object") return plan;
  const version = Number(plan.schemaVersion) || 1;
  if (version >= CURRENT_SCHEMA_VERSION) return plan;

  // v1 -> v2: add the marker. relPath is backfilled lazily by the image
  // resolver (a legacy image keeps working via filePath until it is re-saved);
  // attachments and uploadId are simply absent until first written.
  return { ...plan, schemaVersion: CURRENT_SCHEMA_VERSION };
}
```

**Deliberately not backfilled:** `relPath` for images captured under v1. Those
files live outside the plan folder and copying them at migration time would be a
long blocking I/O operation triggered by merely opening a list of plans. They
keep working through the `filePath` fallback, and they carry the W-01 risk until
uploaded — which is acceptable because v1 plans are, by definition, already at
risk today.

## Compatibility matrix

| Plan written by | Opened by | Result |
|---|---|---|
| v1 (v1.0.9) | v1 | works today |
| v1 (v1.0.9) | v2 build | `migratePlan` stamps version; images resolve via `filePath` fallback; upload works |
| v2 | v2 | full behaviour |
| v2 | v1 build (downgrade) | extra keys ignored by `mergeDeep`; images resolve via `filePath`, which is still present. **Degrades, does not break** |

The downgrade row is why `filePath` is retained in v2 rather than replaced.

## Verification

A single test file covers the contract, created in Batch 3 Task 1 and extended
in Batch 4 Task 1:

```
LIS-Desktop/electron/helpers/planSchema.test.mjs
```

Run with:

```bash
node --test electron/helpers/planSchema.test.mjs
```
