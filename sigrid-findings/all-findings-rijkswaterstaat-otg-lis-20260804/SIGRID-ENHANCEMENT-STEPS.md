# Sigrid Enhancement Steps — LIS (OTG)

**Source:** `all-findings-rijkswaterstaat-otg-lis-20260804`  
**Date:** 2026-08-04  
**Tool:** Sigrid (Software Improvement Group)

This guide lists actionable remediation steps for every finding category. Focus first on **RAW** (open) findings with **HIGH** severity, then MEDIUM, then LOW. Items marked **FIXED** or **ACCEPTED** are noted for completeness but do not need new work unless you reopen them.

---

## Recommended work order

1. Security (open HIGH)
2. Duplication (open HIGH)
3. Module coupling (open HIGH/MEDIUM)
4. Component independence (open HIGH)
5. Component entanglement (open HIGH/MEDIUM)
6. Unit size (MEDIUM first, then largest LOW units)
7. Unit interfacing (LOW)
8. Re-upload / re-analyze in Sigrid and confirm ratings improve

---

## 1. Security findings

| Metric | Count |
|---|---|
| Total | 13 |
| Open (RAW) | 5 |
| Fixed | 8 |

### 1.1 Open findings — do these

#### SEC-1: Missing User Instruction (CWE-266)

- **Severity:** HIGH
- **CWE:** CWE-266
- **File:** `dockerfile`
- **Location:** `dockerfile#L22`
- **Steps:**
  1. Open the Dockerfile at the reported location.
  2. Create a non-root user in the image (e.g. `RUN adduser --disabled-password --gecos "" appuser` or use an existing nginx/node uid).
  3. Add `USER <non-root-user>` **before** `CMD` / `ENTRYPOINT` in the runtime stage.
  4. Ensure the app still has permission to read needed files and bind its port (or use a port >1024 / reverse proxy).
  5. Rebuild the image and verify the process does not run as root (`docker run … whoami` / `id`).
  6. Re-scan in Sigrid and confirm the finding is cleared.

#### SEC-2: Missing User Instruction (CWE-266)

- **Severity:** HIGH
- **CWE:** CWE-266
- **File:** `backend/dockerfile`
- **Location:** `backend/dockerfile#L4`
- **Steps:**
  1. Open the Dockerfile at the reported location.
  2. Create a non-root user in the image (e.g. `RUN adduser --disabled-password --gecos "" appuser` or use an existing nginx/node uid).
  3. Add `USER <non-root-user>` **before** `CMD` / `ENTRYPOINT` in the runtime stage.
  4. Ensure the app still has permission to read needed files and bind its port (or use a port >1024 / reverse proxy).
  5. Rebuild the image and verify the process does not run as root (`docker run … whoami` / `id`).
  6. Re-scan in Sigrid and confirm the finding is cleared.

#### SEC-3: By not specifying a USER, a program in the container may run as 'root' (CWE-250)

- **Severity:** HIGH
- **CWE:** CWE-250
- **File:** `backend/dockerfile`
- **Location:** `backend/dockerfile#L85`
- **Steps:**
  1. Open the Dockerfile at the reported location.
  2. Create a non-root user in the image (e.g. `RUN adduser --disabled-password --gecos "" appuser` or use an existing nginx/node uid).
  3. Add `USER <non-root-user>` **before** `CMD` / `ENTRYPOINT` in the runtime stage.
  4. Ensure the app still has permission to read needed files and bind its port (or use a port >1024 / reverse proxy).
  5. Rebuild the image and verify the process does not run as root (`docker run … whoami` / `id`).
  6. Re-scan in Sigrid and confirm the finding is cleared.

#### SEC-4: By not specifying a USER, a program in the container may run as 'root' (CWE-250)

- **Severity:** HIGH
- **CWE:** CWE-250
- **File:** `dockerfile`
- **Location:** `dockerfile#L32`
- **Steps:**
  1. Open the Dockerfile at the reported location.
  2. Create a non-root user in the image (e.g. `RUN adduser --disabled-password --gecos "" appuser` or use an existing nginx/node uid).
  3. Add `USER <non-root-user>` **before** `CMD` / `ENTRYPOINT` in the runtime stage.
  4. Ensure the app still has permission to read needed files and bind its port (or use a port >1024 / reverse proxy).
  5. Rebuild the image and verify the process does not run as root (`docker run … whoami` / `id`).
  6. Re-scan in Sigrid and confirm the finding is cleared.

#### SEC-5: NPM dependency react-router-dom contains 1 vulnerability (CWE-601)

- **Severity:** MEDIUM
- **CWE:** CWE-601
- **File:** `package-lock.json`
- **Location:** `package-lock.json#L1`
- **Remark:** This dependency contains the following vulnerabilities: CVE-2026-53668 (6.9) For further details, please visit Sigrid's Open Source Health page.
- **Steps:**
  1. Check the vulnerable package version in `package.json` / `package-lock.json`.
  2. Upgrade to a patched version (`npm update <package>` or set an explicit safe version).
  3. Run `npm audit` / review Sigrid Open Source Health for remaining CVEs.
  4. Run the app test suite and smoke-test routing/auth flows.
  5. Commit lockfile changes and re-upload to Sigrid.

### 1.2 Already fixed (no action unless regression)

- [HIGH] NPM dependency axios contains 10 vulnerabilities (CWE-1321) — `package-lock.json`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/csvExportCore.ts`
- [MEDIUM] Untrusted user input in redirect() can result in Open Redirect vulnerability (CWE-601) — `backend/src/routes/auth/authKeycloak/callbackHandler.ts`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/pointsPlansTableExport.ts`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/pointsPlansTableExport.ts`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/csvExport.ts`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/pointsPlansTableExport.ts`
- [MEDIUM] User controlled data in a HTML string may result in XSS (CWE-79) — `src/helpers/tableExports/csvExportCore.ts`

---

## 2. Reliability findings

- **FIXED** [HIGH] NPM dependency axios contains 10 vulnerabilities (CWE-1321) — `package-lock.json`

All listed reliability findings are already **FIXED**. Keep dependencies updated to avoid regressions.

---

## 3. Unit complexity findings

No findings in this export. Keep McCabe complexity low when editing units (prefer extracting helpers when branching grows).

---

## 4. Duplication findings

Open HIGH duplication clusters: **2**

### DUP-1: 9 lines occurring 2 times [HIGH]

- **Status:** RAW
- **Occurrences:** 2
- **Redundant LOC:** 9
- **Same file:** true
- **Locations:**
  - `backend/src/helpers/repositories/flightPlansRepo.ts#L192:201`
  - `backend/src/helpers/repositories/flightPlansRepo.ts#L216:225`
- **Steps:**
  1. Open both code ranges and confirm they are true duplicates (not coincidental).
  2. Extract the shared logic into one helper function/module in the same area.
  3. Replace both copies with calls to the helper.
  4. Run related unit/integration tests.
  5. Re-scan; duplication rating should improve.

### DUP-2: 6 lines occurring 2 times [HIGH]

- **Status:** RAW
- **Occurrences:** 2
- **Redundant LOC:** 6
- **Same file:** true
- **Locations:**
  - `backend/scripts/verifyRegioPointsGeometries.ts#L20:25`
  - `backend/scripts/verifyRegioPointsGeometries.ts#L55:60`
- **Steps:**
  1. Open both code ranges and confirm they are true duplicates (not coincidental).
  2. Extract the shared logic into one helper function/module in the same area.
  3. Replace both copies with calls to the helper.
  4. Run related unit/integration tests.
  5. Re-scan; duplication rating should improve.

### Duplicate block details

- **Cluster `d9912fc0…`**
  - `backend/src/helpers/repositories/flightPlansRepo.ts#192-201` (9 LOC, 5.0% of file)
  - `backend/src/helpers/repositories/flightPlansRepo.ts#216-225` (9 LOC, 5.0% of file)
- **Cluster `9e355934…`**
  - `backend/scripts/verifyRegioPointsGeometries.ts#20-25` (6 LOC, 11.1% of file)
  - `backend/scripts/verifyRegioPointsGeometries.ts#55-60` (6 LOC, 11.1% of file)

#### Concrete targets

1. **`backend/src/helpers/repositories/flightPlansRepo.ts`** (lines ~192–201 and ~216–225)
   - Extract shared SQL/update fragment into a private helper (e.g. `buildFlightPlanUpdateFragment(...)`).
   - Call it from both call sites.
2. **`backend/scripts/verifyRegioPointsGeometries.ts`** (lines ~20–25 and ~55–60)
   - Extract shared verification/setup block into a local function.
   - Reuse in both check paths.

---

## 5. Module coupling findings

Open: **16** · Accepted: **10**

### 5.1 Open findings — reduce fan-in / split hot modules

#### MC-1: `src/hooks/useContent.ts` [HIGH]

- **Finding:** Fan-in of 126 for module with 5 lines of code
- **Fan-in:** 126 · **LOC:** 5
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-2: `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerBuilders.ts` [MEDIUM]

- **Finding:** Fan-in of 33 for module with 50 lines of code
- **Fan-in:** 33 · **LOC:** 50
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-3: `src/Components/HomePage/hooks/consts/useConstSelectOptions.ts` [MEDIUM]

- **Finding:** Fan-in of 26 for module with 17 lines of code
- **Fan-in:** 26 · **LOC:** 17
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-4: `src/Components/HomePageTools/EditGeometry/EditForm/EditGeometryPointPanel/coords.ts` [MEDIUM]

- **Finding:** Fan-in of 24 for module with 9 lines of code
- **Fan-in:** 24 · **LOC:** 9
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-5: `src/helpers/ArcGISHelpers/validateMapView.ts` [MEDIUM]

- **Finding:** Fan-in of 24 for module with 7 lines of code
- **Fan-in:** 24 · **LOC:** 7
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-6: `src/Components/HomePage/hooks/features/useResetFeatures.ts` [MEDIUM]

- **Finding:** Fan-in of 23 for module with 11 lines of code
- **Fan-in:** 23 · **LOC:** 11
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-7: `backend/src/helpers/repositories/pointsRepo.ts` [LOW]

- **Finding:** Fan-in of 20 for module with 212 lines of code
- **Fan-in:** 20 · **LOC:** 212
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-8: `src/Components/HomePage/helpers/dom/classNames.ts` [LOW]

- **Finding:** Fan-in of 20 for module with 3 lines of code
- **Fan-in:** 20 · **LOC:** 3
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-9: `backend/src/helpers/queries/shared/resolveRegioFilter.ts` [LOW]

- **Finding:** Fan-in of 16 for module with 92 lines of code
- **Fan-in:** 16 · **LOC:** 92
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-10: `backend/src/helpers/repositories/flightPlansRepo.ts` [LOW]

- **Finding:** Fan-in of 15 for module with 248 lines of code
- **Fan-in:** 15 · **LOC:** 248
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-11: `backend/src/routes/keycloak/management/users/keycloakAdminClient.ts` [LOW]

- **Finding:** Fan-in of 14 for module with 114 lines of code
- **Fan-in:** 14 · **LOC:** 114
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-12: `src/api-hooks/mutations/useCreateDataCore.ts` [LOW]

- **Finding:** Fan-in of 13 for module with 55 lines of code
- **Fan-in:** 13 · **LOC:** 55
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-13: `src/Components/HomePage/hooks/wizard/useWizardCleanup.ts` [LOW]

- **Finding:** Fan-in of 13 for module with 7 lines of code
- **Fan-in:** 13 · **LOC:** 7
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-14: `src/hooks/zustand/shared/planWizardCore.ts` [LOW]

- **Finding:** Fan-in of 12 for module with 51 lines of code
- **Fan-in:** 12 · **LOC:** 51
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-15: `src/Components/Voorbereiding/DrawingTool/helpers/drawingToolMapCleanup.ts` [LOW]

- **Finding:** Fan-in of 12 for module with 41 lines of code
- **Fan-in:** 12 · **LOC:** 41
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

#### MC-16: `src/Components/HomePage/hooks/handleCancel/useHandleCancel.ts` [LOW]

- **Finding:** Fan-in of 11 for module with 12 lines of code
- **Fan-in:** 11 · **LOC:** 12
- **Steps:**
  1. List importers of this module (IDE "Find all references" / dependency graph).
  2. Split the module into smaller, purpose-specific modules so callers depend only on what they need.
  3. Move shared constants/types to a thin `types`/`constants` module if that is what everyone imports.
  4. Avoid re-export barrels that pull the whole module graph into many features.
  5. Prefer facade hooks per feature domain instead of one global hook used everywhere.
  6. Re-scan and confirm fan-in drops for the former hotspot.

### 5.2 Accepted (monitor only)

- [HIGH] `src/hooks/useLogAction.ts` — fan-in 98, 21 LOC
- [MEDIUM] `src/api-hooks/mutations/useUpdateDataCore.ts` — fan-in 25, 49 LOC
- [MEDIUM] `backend/src/helpers/http/routeResponses.ts` — fan-in 23, 41 LOC
- [MEDIUM] `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandIconPrimitives.tsx` — fan-in 26, 26 LOC
- [MEDIUM] `src/Components/HomePage/hooks/wizard/useWizardButtons.ts` — fan-in 32, 24 LOC
- [LOW] `backend/src/routes/auth2/authSecurityLog.ts` — fan-in 16, 26 LOC
- [LOW] `src/helpers/ArcGISHelpers/getTransformedCoordinates.ts` — fan-in 18, 24 LOC
- [LOW] `backend/src/helpers/http/validateBody.ts` — fan-in 11, 20 LOC
- [LOW] `src/helpers/arcgis/attachmentDisplayUrl.ts` — fan-in 11, 13 LOC
- [LOW] `src/api-hooks/fetchApi.ts` — fan-in 13, 8 LOC

---

## 6. Component independence findings

Sigrid flags these as **interface modules** that are too large or too central. Goal: keep interfaces thin; move implementation behind them.

Open HIGH: **16** · Open MEDIUM: **115**

### 6.1 HIGH — prioritize

#### CI-H-1: `src/helpers/ArcGISHelpers/pointMapGraphicActionsCore.ts` (74 LOC)

- **Finding:** Interface module with 74 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-2: `src/Components/HomePage/Body/Common/EditPoint/editPointMapClickCoords.ts` (35 LOC)

- **Finding:** Interface module with 35 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-3: `src/helpers/geo/buildCoordinateSyncPatchCore.ts` (35 LOC)

- **Finding:** Interface module with 35 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-4: `src/Components/Voorbereiding/common/wizardFilterStepSelection.ts` (32 LOC)

- **Finding:** Interface module with 32 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-5: `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/syncEnrichedCoordsForPreview.ts` (31 LOC)

- **Finding:** Interface module with 31 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-6: `src/Components/HomePage/hooks/wizard/useWizardButtons.ts` (24 LOC)

- **Finding:** Interface module with 24 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-7: `src/api-hooks/points/usePointLookupQueries.ts` (22 LOC)

- **Finding:** Interface module with 22 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-8: `src/hooks/useLogAction.ts` (21 LOC)

- **Finding:** Interface module with 21 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-9: `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` (19 LOC)

- **Finding:** Interface module with 19 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-10: `src/Components/HomePage/hooks/consts/useConstSelectOptions.ts` (17 LOC)

- **Finding:** Interface module with 17 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-11: `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/useCoordinatesWatcher.ts` (15 LOC)

- **Finding:** Interface module with 15 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-12: `src/Components/Voorbereiding/EnrichedAddPoint/helpers/createNewPoint.ts` (14 LOC)

- **Finding:** Interface module with 14 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-13: `src/Components/HomePage/hooks/map/useGetFlightTimesDistance.ts` (14 LOC)

- **Finding:** Interface module with 14 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-14: `src/helpers/arcgis/attachmentDisplayUrl.ts` (13 LOC)

- **Finding:** Interface module with 13 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-15: `src/helpers/http/refreshToken.ts` (11 LOC)

- **Finding:** Interface module with 11 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

#### CI-H-16: `src/helpers/geo/transformWgs84ToRd.ts` (9 LOC)

- **Finding:** Interface module with 9 lines of code
- **Steps:**
  1. Identify public exports used across components.
  2. Keep a thin public API file; move heavy logic into internal `*Core` / private helpers in the owning feature.
  3. Stop cross-feature imports of implementation details; import only the thin interface.
  4. If this file is both “API” and “implementation”, split into `index` (exports) + implementation module.
  5. Re-scan; interface LOC / independence score should improve.

### 6.2 MEDIUM — full file list with steps

For each file below, apply the same pattern:

1. Measure who imports it and why.
2. Extract implementation out of the interface surface.
3. Reduce exported surface area; hide internals.
4. Prefer feature-local modules over shared “god” helpers.
5. Re-scan after each batch of related files.

| # | File | LOC | Enhancement steps |
|---|---|---|---|
| CI-M-1 | `src/helpers/ArcGISHelpers/centerAndZoomMathCore.ts` | 116 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-2 | `src/helpers/ArcGISHelpers/geometryMapGraphicActionsCore.ts` | 84 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-3 | `src/Components/HomePage/helpers/points/flightPlanPointExcelCore.ts` | 82 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-4 | `src/helpers/ArcGISHelpers/geometryMapGraphicFactoriesCore.ts` | 78 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-5 | `src/helpers/ArcGISHelpers/createGeometryGraphicInternal.ts` | 66 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-6 | `src/helpers/ArcGISHelpers/bufferFlightPlansOnLayerCore.ts` | 63 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-7 | `src/helpers/ArcGISHelpers/bufferPointsOnLayerCore.ts` | 61 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-8 | `src/Components/HomePage/hooks/zustand/tools/deletePointFormFields.ts` | 59 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-9 | `src/Components/HomePage/hooks/points/useWizardPointsFilterHeaderCore.tsx` | 56 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-10 | `src/helpers/ArcGISHelpers/buildPlanBoundingBoxGraphicCore.ts` | 55 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-11 | `src/api-hooks/mutations/useCreateDataCore.ts` | 55 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-12 | `src/helpers/ArcGISHelpers/planBoundingBoxGeometryCore.ts` | 54 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-13 | `src/Components/HomePage/hooks/flightPlan/submitCollectedFlightPlanCreate.ts` | 52 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-14 | `src/Components/HomePage/hooks/filters/useFilteredSortedPlansCore.ts` | 51 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-15 | `src/hooks/zustand/shared/planWizardCore.ts` | 51 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-16 | `src/hooks/zustand/shared/flightPlanFormSettersCore.ts` | 50 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-17 | `src/Components/HomePage/helpers/tableExports/xlsxExportCore.ts` | 50 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-18 | `src/api-hooks/mutations/useUpdateDataCore.ts` | 49 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-19 | `src/helpers/ArcGISHelpers/planStarGraphicsCore.ts` | 48 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-20 | `src/api-hooks/mutations/useDeleteDataCore.ts` | 45 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-21 | `src/hooks/time/useTimeRangeCore.ts` | 44 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-22 | `src/helpers/ArcGISHelpers/pointGraphicCoordinates.ts` | 43 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-23 | `src/helpers/ArcGISHelpers/pointMapGraphicFactoriesCore.ts` | 43 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-24 | `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | 42 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-25 | `src/Components/Voorbereiding/common/useWizardFilterStep2Buttons.ts` | 42 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-26 | `src/helpers/auth/arcgisTokenRegistration.ts` | 41 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-27 | `src/helpers/ArcGISHelpers/pointGraphicFactoryCore.ts` | 41 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-28 | `src/Components/HomePage/hooks/hover-click-handlers/useDrawPathCore.ts` | 40 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-29 | `src/helpers/ArcGISHelpers/finishedPlanCentroidMarkersCore.ts` | 38 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-30 | `src/helpers/ArcGISHelpers/createQuadrantGraphic.ts` | 37 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-31 | `src/api-hooks/templateFlights/useTemplateFlights.ts` | 36 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-32 | `src/Components/HomePage/hooks/flightPlan/flightPlanFormLabelsCore.ts` | 34 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-33 | `src/helpers/ArcGISHelpers/centerAndZoomFromPlanCore.ts` | 32 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-34 | `src/helpers/ArcGISHelpers/syncBluePointGraphicsCore.ts` | 32 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-35 | `src/helpers/ArcGISHelpers/flightPlanMapActions.ts` | 32 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-36 | `src/helpers/ArcGISHelpers/geometryPathFromPoints.ts` | 31 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-37 | `src/api-hooks/planImages/pointPlanImagesToAttachments.ts` | 31 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-38 | `src/Components/HomePage/hooks/hover-click-handlers/useEditGeometryVerticesOnMap.ts` | 30 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-39 | `src/Components/HomePage/hooks/flightPlan/flightPlanStandardSelectProps.ts` | 30 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-40 | `backend/src/configure/configureBodyParsersAndSwagger.ts` | 29 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-41 | `src/Components/HomePage/hooks/flightPlan/assembleFlightPlanCreateAttributes.ts` | 29 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-42 | `src/Components/HomePage/hooks/points/useHerhalenSelectionHandlers.ts` | 28 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-43 | `src/helpers/geo/applyCoordinateSyncPatchToSetters.ts` | 28 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-44 | `src/Components/HomePage/helpers/points/buildPointUpdatePayload.ts` | 28 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-45 | `src/Components/HomePage/hooks/features/useHoverPointsAndGeometries.ts` | 26 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-46 | `src/helpers/ArcGISHelpers/createMapView.ts` | 25 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-47 | `src/helpers/ArcGISHelpers/createYellowBorder.ts` | 25 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-48 | `src/Components/HomePage/hooks/filters/useFilterPoints.ts` | 25 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-49 | `src/Components/HomePage/hooks/wizard/clearMapSelectionGraphics.ts` | 24 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-50 | `src/Components/HomePage/hooks/flightPlan/buildFlightPlanPayloadFields.ts` | 24 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-51 | `src/hooks/zustand/shared/periodFilterState.ts` | 24 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-52 | `src/helpers/ArcGISHelpers/getTransformedCoordinates.ts` | 24 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-53 | `src/Components/HomePage/hooks/flightPlan/pickFlightPlanPersistenceFields.ts` | 24 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-54 | `src/helpers/ArcGISHelpers/finishedPlanMapGraphics.ts` | 23 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-55 | `src/helpers/plans/filterPlans.ts` | 22 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-56 | `src/Components/Voorbereiding/EnrichedAddPoint/helpers/buildCreatePointPayload.ts` | 22 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-57 | `src/Components/HomePage/hooks/hover-click-handlers/useDrawYellowMarkers.ts` | 22 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-58 | `src/helpers/geo/bboxPolygon.ts` | 21 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-59 | `src/Components/HomePage/hooks/hover-click-handlers/useGeometryClick.ts` | 21 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-60 | `src/Components/HomePage/hooks/filters/useFilterPlans.ts` | 21 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-61 | `src/hooks/zustand/shared/planListFilterFields.ts` | 20 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-62 | `src/Components/HomePage/hooks/handleCancel/useCancelCreateFlightPlan.ts` | 20 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-63 | `src/Components/HomePage/hooks/hover-click-handlers/useDrawYellowGeometries.ts` | 20 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-64 | `src/helpers/ArcGISHelpers/createPin.ts` | 19 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-65 | `src/helpers/ArcGISHelpers/createPoint.ts` | 19 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-66 | `src/hooks/zustand/shared/planContentSelectionSetters.ts` | 18 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-67 | `src/Components/HomePage/helpers/points/sortPointsByImageCount.ts` | 18 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-68 | `src/helpers/ArcGISHelpers/createYellowWgs84PointGraphic.ts` | 18 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-69 | `src/Components/HomePage/hooks/features/useFetchInitialFeatures.ts` | 17 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-70 | `src/helpers/points/starredPointSelection.ts` | 17 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-71 | `src/Components/HomePage/hooks/flightPlan/usePopulateFlightPlanFormEffect.ts` | 17 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-72 | `src/Components/HomePage/hooks/map/mapClickGuard.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-73 | `src/api-hooks/planImages/usePointPlanImages.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-74 | `src/helpers/ArcGISHelpers/pointHoverGraphics.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-75 | `src/Components/Voorbereiding/EnrichedAddPoint/helpers/findSpecificPoint.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-76 | `src/helpers/ArcGISHelpers/createNewPointEvent.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-77 | `src/api-hooks/planImages/useGeometryPlanImages.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-78 | `src/Components/HomePage/hooks/hover-click-handlers/useFinishedPlanMapHighlight.ts` | 16 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-79 | `src/helpers/ArcGISHelpers/selectedGeometryGraphics.ts` | 15 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-80 | `src/api-hooks/finishedPlans/useFinishedPlanQueries.ts` | 15 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-81 | `src/Components/HomePage/hooks/handleCancel/useHandleClearFinishedPlan.ts` | 15 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-82 | `src/helpers/arcgis/deleteArcgisAttachment.ts` | 14 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-83 | `src/hooks/zustand/pickEnrichedCoordinateControls.ts` | 14 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-84 | `src/Components/HomePage/hooks/map/useRenderVluchtPlans.ts` | 13 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-85 | `src/api-hooks/consts/useLookupQuery.ts` | 13 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-86 | `src/Components/HomePage/hooks/editPoint/useCoordinateSystemSync.ts` | 13 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-87 | `src/helpers/geo/getDistanceMeters.ts` | 13 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-88 | `src/lib/useDebouncedValue.ts` | 13 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-89 | `src/helpers/geometry/matchesGeometryRepeat.ts` | 12 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-90 | `src/Components/HomePage/hooks/handleCancel/useHandleCancel.ts` | 12 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-91 | `src/Components/HomePage/hooks/features/useRenderLocalGeometries.ts` | 12 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-92 | `src/hooks/zustand/shared/flightPlanFormValues.ts` | 12 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-93 | `src/helpers/ArcGISHelpers/replaceGraphics.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-94 | `src/api-hooks/flightPlans/useRegionalFlightPlanQueries.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-95 | `src/helpers/http/getBackEndUrl.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-96 | `src/helpers/http/base64ToBlob.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-97 | `src/Components/HomePage/hooks/filters/filterPlanPoints.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-98 | `src/lib/invalidateAfterMutation.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-99 | `src/Components/HomePage/hooks/features/useResetFeatures.ts` | 11 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-100 | `src/helpers/auth/getLoginUrlWithReturn.ts` | 10 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-101 | `src/api-hooks/emails/useEmailsList.ts` | 10 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-102 | `src/Components/HomePage/hooks/hover-click-handlers/useGeometryListHover.ts` | 10 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-103 | `src/Components/HomePage/hooks/hover-click-handlers/usePointHover.ts` | 10 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-104 | `src/Components/HomePage/hooks/hover-click-handlers/usePointClick.ts` | 9 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-105 | `src/Components/HomePage/Body/Left/Common/logFlightPlanRowClick.ts` | 9 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-106 | `src/helpers/ArcGISHelpers/validateMapView.ts` | 7 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-107 | `src/Components/HomePage/hooks/flightPlan/useFlightPlanFormSelectOptions.ts` | 7 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-108 | `src/Components/HomePage/hooks/wizard/useWizardCleanup.ts` | 7 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-109 | `src/Components/HomePage/hooks/hover-click-handlers/useGeometryEditHighlight.ts` | 6 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-110 | `src/Components/HomePage/hooks/hover-click-handlers/usePlanHover.ts` | 6 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-111 | `src/Components/HomePage/hooks/hover-click-handlers/usePlanClick.ts` | 6 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-112 | `src/hooks/useContent.ts` | 5 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-113 | `src/helpers/geo/haversine.ts` | 4 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-114 | `src/Components/HomePage/helpers/dom/isValidEmail.ts` | 4 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |
| CI-M-115 | `src/Components/HomePage/helpers/dom/classNames.ts` | 3 | Thin the public API; move logic to feature-internal modules; reduce cross-component coupling. |

---

## 7. Component entanglement findings

Open: **45** · Accepted: **5**

### 7.1 Communication density (open)

High density means too many internal call relationships inside a component folder. Reduce chatty cross-imports.

#### CE-D-1: `src/Components/HomePage` [HIGH]

- **Finding:** Very high communication density on src/Components/HomePage
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-2: `src/hooks` [HIGH]

- **Finding:** Very high communication density on src/hooks
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-3: `src/Components/Nabewerking/VluchtenZoeken` [MEDIUM]

- **Finding:** High communication density on src/Components/Nabewerking/VluchtenZoeken
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-4: `src/Components/Voorbereiding/FlightPlan` [MEDIUM]

- **Finding:** High communication density on src/Components/Voorbereiding/FlightPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-5: `src/helpers/geo` [MEDIUM]

- **Finding:** High communication density on src/helpers/geo
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-6: `src/Components/Nabewerking/CreateReport` [MEDIUM]

- **Finding:** High communication density on src/Components/Nabewerking/CreateReport
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-7: `src/Components/Voorbereiding/EnrichedAddPoint` [MEDIUM]

- **Finding:** High communication density on src/Components/Voorbereiding/EnrichedAddPoint
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-8: `src/Components/Voorbereiding/ViewPlan` [MEDIUM]

- **Finding:** High communication density on src/Components/Voorbereiding/ViewPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-9: `src/Components/Voorbereiding/TemplateFlight` [MEDIUM]

- **Finding:** High communication density on src/Components/Voorbereiding/TemplateFlight
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-10: `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` [MEDIUM]

- **Finding:** High communication density on src/Components/Voorbereiding/SelectedPoint/EditPointDetails
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-11: `src/Components/HomePageTools/AandachtspuntenVerwijderen` [MEDIUM]

- **Finding:** High communication density on src/Components/HomePageTools/AandachtspuntenVerwijderen
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-12: `src/Components/Voorbereiding/DrawingTool` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/DrawingTool
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-13: `src/Components/Voorbereiding/ReuseFlightPlan` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/ReuseFlightPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-14: `src/Components/HomePageTools/EditGeometry` [LOW]

- **Finding:** Moderate communication density on src/Components/HomePageTools/EditGeometry
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-15: `src/Components/Voorbereiding/AddPointsVluchtPlan` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/AddPointsVluchtPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-16: `src/Components/Voorbereiding/SelectedPoint/AddToPlan` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/SelectedPoint/AddToPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-17: `src/Components/Voorbereiding/common` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/common
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-18: `src/Components/Voorbereiding/RemoveFlightPlan` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/RemoveFlightPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-19: `src/Components/Nabewerking/ChangeFlightPlanStatus` [LOW]

- **Finding:** Moderate communication density on src/Components/Nabewerking/ChangeFlightPlanStatus
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-20: `src/Components/Voorbereiding/PrepareFlightPlan` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/PrepareFlightPlan
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-21: `src/Components/Voorbereiding/SelectedPoint/DeletePoint` [LOW]

- **Finding:** Moderate communication density on src/Components/Voorbereiding/SelectedPoint/DeletePoint
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

#### CE-D-22: `src/Components/HomePageTools/Emailijst` [LOW]

- **Finding:** Moderate communication density on src/Components/HomePageTools/Emailijst
- **Steps:**
  1. Map internal imports inside this folder (who talks to whom).
  2. Introduce a clear internal layering: UI → hooks → helpers → api (one direction only).
  3. Collapse duplicate glue modules; prefer one orchestrator per feature step.
  4. Extract shared utilities used by many siblings into a small `common/` with a stable API.
  5. Avoid circular imports and deep relative chains (`../../../`).
  6. Re-scan after restructuring a vertical slice.

### 7.2 Layer-bypassing / transitive dependencies (open)

These mean a component reaches a lower/shared layer transitively (or skips intended layers). Route access through the intended API.

#### CE-L-1: `src/Components/Nabewerking/VluchtenZoeken` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/VluchtenZoeken and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/VluchtenZoeken` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Nabewerking/VluchtenZoeken`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-2: `src/Components/Nabewerking/CreateReport` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/CreateReport and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/CreateReport` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Nabewerking/CreateReport`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-3: `src/Components/Voorbereiding/ReuseFlightPlan` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/ReuseFlightPlan and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/ReuseFlightPlan` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/ReuseFlightPlan`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-4: `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/SelectedPoint/EditPointDetails and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/SelectedPoint/EditPointDetails`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-5: `src/Components/Voorbereiding/RemoveFlightPlan` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/RemoveFlightPlan and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/RemoveFlightPlan` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/RemoveFlightPlan`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-6: `src/Components/Nabewerking/ChangeFlightPlanStatus` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/ChangeFlightPlanStatus and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/ChangeFlightPlanStatus` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Nabewerking/ChangeFlightPlanStatus`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-7: `src/Components/HomePageTools/EditGeometry` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/HomePageTools/EditGeometry and src/hooks
- **Steps:**
  1. Find imports from `src/Components/HomePageTools/EditGeometry` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/HomePageTools/EditGeometry`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-8: `src/Components/Nabewerking/CreateReport` → `src/helpers/arcgis` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/CreateReport and src/helpers/arcgis
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/CreateReport` that pull in `src/helpers/arcgis` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/arcgis` or move the needed code closer to `src/Components/Nabewerking/CreateReport`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-9: `src/Components/Voorbereiding/DrawingTool` → `src/helpers/ArcGISHelpers` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/DrawingTool and src/helpers/ArcGISHelpers
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/DrawingTool` that pull in `src/helpers/ArcGISHelpers` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/ArcGISHelpers` or move the needed code closer to `src/Components/Voorbereiding/DrawingTool`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-10: `src/Components/Voorbereiding/AddPointsVluchtPlan` → `src/helpers/ArcGISHelpers` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/AddPointsVluchtPlan and src/helpers/ArcGISHelpers
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/AddPointsVluchtPlan` that pull in `src/helpers/ArcGISHelpers` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/ArcGISHelpers` or move the needed code closer to `src/Components/Voorbereiding/AddPointsVluchtPlan`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-11: `src/Components/Nabewerking/VluchtenZoeken` → `src/helpers/arcgis` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/VluchtenZoeken and src/helpers/arcgis
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/VluchtenZoeken` that pull in `src/helpers/arcgis` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/arcgis` or move the needed code closer to `src/Components/Nabewerking/VluchtenZoeken`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-12: `src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-13: `src/Components/HomePageTools/AandachtspuntenVerwijderen` → `src/helpers/geo` [LOW]

- **Finding:** Transitive dependency between src/Components/HomePageTools/AandachtspuntenVerwijderen and src/helpers/geo
- **Steps:**
  1. Find imports from `src/Components/HomePageTools/AandachtspuntenVerwijderen` that pull in `src/helpers/geo` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/geo` or move the needed code closer to `src/Components/HomePageTools/AandachtspuntenVerwijderen`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-14: `src/Components/Voorbereiding/AddPointsVluchtPlan` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/AddPointsVluchtPlan and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/AddPointsVluchtPlan` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/AddPointsVluchtPlan`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-15: `src/Components/Voorbereiding/DrawingTool` → `src/hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/DrawingTool and src/hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/DrawingTool` that pull in `src/hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/hooks` or move the needed code closer to `src/Components/Voorbereiding/DrawingTool`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-16: `src/Components/Nabewerking/VluchtenZoeken` → `src/helpers/http` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/VluchtenZoeken and src/helpers/http
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/VluchtenZoeken` that pull in `src/helpers/http` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/http` or move the needed code closer to `src/Components/Nabewerking/VluchtenZoeken`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-17: `src/Components/Voorbereiding/SelectedPoint/DeletePoint` → `src/api-hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/SelectedPoint/DeletePoint and src/api-hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/SelectedPoint/DeletePoint` that pull in `src/api-hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/api-hooks` or move the needed code closer to `src/Components/Voorbereiding/SelectedPoint/DeletePoint`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-18: `src/Components/Voorbereiding/ReuseFlightPlan` → `src/helpers/ArcGISHelpers` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/ReuseFlightPlan and src/helpers/ArcGISHelpers
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/ReuseFlightPlan` that pull in `src/helpers/ArcGISHelpers` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/ArcGISHelpers` or move the needed code closer to `src/Components/Voorbereiding/ReuseFlightPlan`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-19: `src/Components/Voorbereiding/DrawingTool` → `src/api-hooks` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/DrawingTool and src/api-hooks
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/DrawingTool` that pull in `src/api-hooks` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/api-hooks` or move the needed code closer to `src/Components/Voorbereiding/DrawingTool`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-20: `src/Components/HomePageTools/AandachtspuntenVerwijderen` → `src/helpers/ArcGISHelpers` [LOW]

- **Finding:** Transitive dependency between src/Components/HomePageTools/AandachtspuntenVerwijderen and src/helpers/ArcGISHelpers
- **Steps:**
  1. Find imports from `src/Components/HomePageTools/AandachtspuntenVerwijderen` that pull in `src/helpers/ArcGISHelpers` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/ArcGISHelpers` or move the needed code closer to `src/Components/HomePageTools/AandachtspuntenVerwijderen`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-21: `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` → `src/helpers/ArcGISHelpers` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/SelectedPoint/EditPointDetails and src/helpers/ArcGISHelpers
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` that pull in `src/helpers/ArcGISHelpers` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/ArcGISHelpers` or move the needed code closer to `src/Components/Voorbereiding/SelectedPoint/EditPointDetails`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-22: `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` → `src/helpers/geo` [LOW]

- **Finding:** Transitive dependency between src/Components/Voorbereiding/SelectedPoint/EditPointDetails and src/helpers/geo
- **Steps:**
  1. Find imports from `src/Components/Voorbereiding/SelectedPoint/EditPointDetails` that pull in `src/helpers/geo` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/geo` or move the needed code closer to `src/Components/Voorbereiding/SelectedPoint/EditPointDetails`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

#### CE-L-23: `src/Components/Nabewerking/VluchtenZoeken` → `src/helpers/geo` [LOW]

- **Finding:** Transitive dependency between src/Components/Nabewerking/VluchtenZoeken and src/helpers/geo
- **Steps:**
  1. Find imports from `src/Components/Nabewerking/VluchtenZoeken` that pull in `src/helpers/geo` (directly or via deep relative paths).
  2. Decide the allowed dependency: either expose a narrow API from `src/helpers/geo` or move the needed code closer to `src/Components/Nabewerking/VluchtenZoeken`.
  3. Replace deep imports with the feature’s own hook/helper wrapper where possible.
  4. For `src/hooks` / `src/api-hooks` / `src/helpers/*` targets: create feature-local facades instead of every screen importing shared internals.
  5. Re-scan; layer-bypass findings should drop for that pair.

### 7.3 Accepted entanglement (monitor)

- [HIGH] Very high communication density on src/api-hooks
- [HIGH] Very high communication density on src/helpers/ArcGISHelpers
- [MEDIUM] High communication density on src/helpers/http
- [MEDIUM] High communication density on src/helpers/arcgis
- [LOW] Moderate communication density on src/Components/TimesliderItemDetailPage

---

## 8. Unit interfacing findings

Too many parameters on a unit. Prefer options objects / smaller focused functions.

Open findings: **15** (all LOW)

### UI-1: `middleware.ts.attachDeviceFromToken(Request,Response,string,NextFunction)` [LOW]

- **File:** `backend/src/routes/devices-updates/middleware.ts`
- **Parameters:** 4 · **LOC:** 19
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-2: `requireAuthClientHeader.ts.requireAuthClientHeader(any,any,any)` [LOW]

- **File:** `backend/src/routes/auth2/requireAuthClientHeader.ts`
- **Parameters:** 3 · **LOC:** 16
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-3: `requirePassword.ts.requirePassword(express.Request,express.Response,express.NextFunction)` [LOW]

- **File:** `backend/src/helpers/auth/requirePassword.ts`
- **Parameters:** 3 · **LOC:** 14
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-4: `installersHandlers.ts.handleInstallerUploadMiddleware(Request,Response,void)` [LOW]

- **File:** `backend/src/routes/installersHandlers.ts`
- **Parameters:** 3 · **LOC:** 11
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-5: `requireSessionAuth.ts.RequestHandler(any,any,any)` [LOW]

- **File:** `backend/src/helpers/auth/requireSessionAuth.ts`
- **Parameters:** 3 · **LOC:** 10
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-6: `legacyAuthUsageMonitor.ts.legacyAuthUsageMonitor(any,any,any)` [LOW]

- **File:** `backend/src/helpers/auth/legacyAuthUsageMonitor.ts`
- **Parameters:** 3 · **LOC:** 10
- **Steps:**
  1. Group related parameters into a typed object (e.g. `input` / `options`).
  2. Keep the public function at ≤2–3 parameters where practical.
  3. Update call sites and tests.
  4. Re-scan.

### UI-7: `middleware.ts.RequestHandler(any,any,any)` [LOW]

- **File:** `backend/src/routes/devices-updates/middleware.ts`
- **Parameters:** 3 · **LOC:** 8
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-8: `installersUpload.ts.fileFilter(any,any,any)` [LOW]

- **File:** `backend/src/routes/installersUpload.ts`
- **Parameters:** 3 · **LOC:** 8
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-9: `realmAdminAuth.ts.requireAdmin(any,any,any)` [LOW]

- **File:** `backend/src/helpers/auth/realmAdminAuth.ts`
- **Parameters:** 3 · **LOC:** 7
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-10: `attachmentsRepo.ts.insertAttachment(Queryable,AttachmentInsertInput,any)` [LOW]

- **File:** `backend/src/helpers/repositories/attachmentsRepo.ts`
- **Parameters:** 3 · **LOC:** 7
- **Steps:**
  1. Group related parameters into a typed object (e.g. `input` / `options`).
  2. Keep the public function at ≤2–3 parameters where practical.
  3. Update call sites and tests.
  4. Re-scan.

### UI-11: `reportUpload.ts.filename(any,any,any)` [LOW]

- **File:** `backend/src/routes/reportUpload.ts`
- **Parameters:** 3 · **LOC:** 6
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-12: `flightPlansRepo.ts.updateFlightPlanReturning(Queryable,FlightPlanBodySource,unknown)` [LOW]

- **File:** `backend/src/helpers/repositories/flightPlansRepo.ts`
- **Parameters:** 3 · **LOC:** 6
- **Steps:**
  1. Group related parameters into a typed object (e.g. `input` / `options`).
  2. Keep the public function at ≤2–3 parameters where practical.
  3. Update call sites and tests.
  4. Re-scan.

### UI-13: `reportUpload.ts.fileFilter(express.Request,Express.Multer.File,multer.FileFilterCallback)` [LOW]

- **File:** `backend/src/routes/reportUpload.ts`
- **Parameters:** 3 · **LOC:** 5
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-14: `installersUpload.ts.filename(any,any,any)` [LOW]

- **File:** `backend/src/routes/installersUpload.ts`
- **Parameters:** 3 · **LOC:** 4
- **Steps:**
  1. Confirm whether this is framework-mandated `(req, res, next)` / multer signature.
  2. If framework-mandated: extract business logic into a helper with a single options/context object; keep the thin middleware wrapper.
  3. If not mandated: introduce a typed `options` / `context` parameter object.
  4. Update call sites and tests.
  5. Re-scan.

### UI-15: `FeatureDeleteAttachmentsResponse.failedDeleteDescription(NonNullable,any,any)` [LOW]

- **File:** `src/helpers/arcgis/deleteAttachmentsResponse.ts`
- **Parameters:** 3 · **LOC:** 3
- **Steps:**
  1. Group related parameters into a typed object (e.g. `input` / `options`).
  2. Keep the public function at ≤2–3 parameters where practical.
  3. Update call sites and tests.
  4. Re-scan.

---

## 9. Unit size findings

Total open unit-size findings: **690**
- MEDIUM: 2
- LOW: 688

**General refactor pattern for every unit below:**

1. Open the unit at the reported line range.
2. Identify cohesive blocks (validation, mapping, IO, UI render, SQL).
3. Extract helpers / subcomponents / hooks until the main unit is clearly under the Sigrid threshold (aim well below 30 LOC for leaf units).
4. Keep names intention-revealing; avoid “Utils” dumping grounds.
5. Run tests for the feature; re-scan in batches.

### 9.1 MEDIUM — do first

#### US-M-1: `dockerfile`

- **Severity:** MEDIUM
- **Location:** `backend/dockerfile#L1:86`
- **LOC:** 59 · **McCabe:** - · **Params:** -
- **Steps:**
  1. Split the unit into smaller functions/stages (setup → work → result).
  2. For Dockerfiles: reduce RUN layers by extracting scripts, or move install steps into shell scripts referenced by the Dockerfile when possible.
  3. For TS scripts/helpers: extract pure helpers and keep the entry function short.
  4. Re-scan after the split.

#### US-M-2: `verifyRegioApisHelpers.ts`

- **Severity:** MEDIUM
- **Location:** `backend/scripts/verifyRegioApisHelpers.ts#L1:25`
- **LOC:** 47 · **McCabe:** 1 · **Params:** 0
- **Steps:**
  1. Split the unit into smaller functions/stages (setup → work → result).
  2. For Dockerfiles: reduce RUN layers by extracting scripts, or move install steps into shell scripts referenced by the Dockerfile when possible.
  3. For TS scripts/helpers: extract pure helpers and keep the entry function short.
  4. Re-scan after the split.

### 9.2 LOW — all units (largest first)

| # | LOC | Unit | File location | Enhancement steps |
|---|---|---|---|---|
| US-L-1 | 30 | `runCreateImageUpload.ts.runCreateImageUpload(CreateImageUploadInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/runCreateImageUpload.ts#L19:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-2 | 30 | `LegendSectionCore.ts.useLegendSectionModel(LegendSectionProps)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/LegendSectionCore.ts#L159:188` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-3 | 30 | `getFinishedPlansTimeslider.ts.getFinishedPlansTimeslider(Request,Response)` | `backend/src/routes/timeslider/getFinishedPlansTimeslider.ts#L7:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-4 | 30 | `geoJsonExportCore.ts.exportPointsPlansGeoJsonZip(any)` | `src/Components/HomePage/helpers/tableExports/geoJsonExportCore.ts#L6:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-5 | 30 | `TimesliderImageViewer.tsx.buildMainImageProps(TimesliderImageViewerProps,any)` | `src/Components/TimesliderItemDetailPage/sections/TimesliderImageViewer.tsx#L58:89` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-6 | 30 | `index.tsx.FlightPlans(any)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/FlightPlans/index.tsx#L9:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-7 | 30 | `index.tsx.EditPointDetails()` | `src/Components/Voorbereiding/SelectedPoint/EditPointDetails/index.tsx#L14:84` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-8 | 30 | `verifyRegioPointsGeometries.ts.runPointsRegioCheck(any)` | `backend/scripts/verifyRegioPointsGeometries.ts#L19:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-9 | 30 | `oidcClientCache.ts.getOrCreateOidcClient(Profile)` | `backend/src/routes/auth/oidcClientCache.ts#L65:97` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-10 | 30 | `spoedReportHtml.ts` | `backend/src/routes/emails/spoedReportHtml.ts#L1:81` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-11 | 30 | `WizardPointsList.tsx.WizardPointsList(WizardPointsListProps)` | `src/Components/HomePage/Body/Left/Common/WizardPointsList.tsx#L38:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-12 | 30 | `Buttons.tsx.Buttons(any)` | `src/Components/Voorbereiding/TemplateFlight/Steps/Step3/Buttons.tsx#L19:53` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-13 | 30 | `renderDownloadPage.ts.renderDownloadPage(any)` | `backend/src/helpers/html/renderDownloadPage.ts#L21:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-14 | 30 | `useEditUserFormModel.ts.useEditUserFormModel()` | `src/Components/DashboardPage/EditUser/useEditUserFormModel.ts#L8:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-15 | 30 | `index.tsx.StepNo(any)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/StepNo/index.tsx#L9:86` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-16 | 30 | `CoordinatesInput.tsx.CoordinatesInput()` | `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/CoordinatesInput.tsx#L6:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-17 | 30 | `finishedPlansQuerySql.ts.buildSingleFinishedPlanCtes()` | `backend/src/helpers/repositories/finishedPlansQuerySql.ts#L14:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-18 | 30 | `index.tsx.Form(EditObservationFormProps)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/Form/index.tsx#L15:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-19 | 30 | `handleConfirm()` | `src/Components/Voorbereiding/DrawingTool/Step1/ConfirmButton.tsx#L20:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-20 | 30 | `fileDownload.ts` | `backend/src/routes/fileDownload.ts#L1:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-21 | 30 | `index.tsx.Points(any)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/index.tsx#L19:59` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-22 | 29 | `Section1.tsx.Section1(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Overig/Section1.tsx#L5:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-23 | 29 | `index.tsx.Left(any)` | `src/Components/HomePage/Body/Left/index.tsx#L32:120` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-24 | 29 | `coordinateFinalize.ts.finalizeCoordinateValues(string,any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/coordinateFinalize.ts#L6:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-25 | 29 | `deletePoint.ts.deletePoint(Request,Response)` | `backend/src/routes/finished_plans/deletePoint.ts#L7:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-26 | 29 | `NewPointsList.tsx.NewPointsList()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/NewPointsList.tsx#L9:17` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-27 | 29 | `removePoint(string)` | `src/Components/Voorbereiding/ViewPlan/Steps/EditPoint/Buttons/RemovePoint.tsx#L23:53` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-28 | 29 | `mapHoverHighlight.ts` | `src/Components/HomePage/Body/MapViewComp/mapHoverHighlight.ts#L1:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-29 | 29 | `useChangePlanStatusState.ts` | `src/Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState.ts#L1:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-30 | 29 | `Section2.tsx.Section2(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Overig/Section2.tsx#L6:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-31 | 29 | `EditPointTabs.tsx.resolveEditPointTabDefs(any)` | `src/Components/HomePage/Body/Left/Common/BottomTabs/EditPointTabs.tsx#L52:88` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-32 | 29 | `GetUserRolesInput.getUserRoles(GetUserRolesInput)` | `backend/src/routes/keycloak/management/users/helpers.ts#L16:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-33 | 29 | `useDrawPathCore.ts.useDrawPath(boolean)` | `src/Components/HomePage/hooks/hover-click-handlers/useDrawPathCore.ts#L14:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-34 | 29 | `Section3.tsx.Section3(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Overig/Section3.tsx#L5:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-35 | 29 | `useRenderPoints.ts.useRenderPoints(FinishedFlightPlanType\|null,number[])` | `src/Components/Nabewerking/CreateReport/Steps/Step2/hooks/useRenderPoints.ts#L7:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-36 | 29 | `usePopupOpenEffect.ts.usePopupOpenEffect(void)` | `src/Components/HomePage/hooks/popUpModal/usePopupOpenEffect.ts#L12:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-37 | 29 | `useTimesliderPlansFetch.ts.useTimesliderPlansFetch(any)` | `src/Components/TimesliderItemDetailPage/hooks/useTimesliderPlansFetch.ts#L18:53` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-38 | 29 | `reportAgentStatus.ts.RequestHandler(any,any)` | `backend/src/routes/devices-updates/agent/reportAgentStatus.ts#L9:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-39 | 29 | `deletePointStateCore.ts` | `src/Components/HomePage/hooks/zustand/tools/deletePointStateCore.ts#L1:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-40 | 29 | `useTimesliderDerivedPlans.ts.useTimesliderDerivedPlans(any)` | `src/Components/TimesliderItemDetailPage/hooks/useTimesliderDerivedPlans.ts#L8:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-41 | 29 | `mapImage.ts.getStaticMapImage(any)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/mapImage.ts#L37:75` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-42 | 29 | `useDrawingToolSketchState.ts.useDrawingToolSketchState()` | `src/Components/Voorbereiding/DrawingTool/Step1/useDrawingToolSketchState.ts#L9:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-43 | 28 | `useTabHeaderModel.ts.useTabHeaderModel()` | `src/Components/HomePage/Body/Left/Common/TabHeader/useTabHeaderModel.ts#L11:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-44 | 28 | `verifyCredentialsHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth2/verifyCredentialsHandler.ts#L42:70` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-45 | 28 | `index.tsx.DevicesUpdatesPage()` | `src/Components/DevicesUpdatesPage/index.tsx#L27:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-46 | 28 | `index.tsx.Step2()` | `src/Components/Nabewerking/CreateReport/Steps/Step2/index.tsx#L14:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-47 | 28 | `useWaarnemingenFilters.ts.useWaarnemingenFilters()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/useWaarnemingenFilters.ts#L5:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-48 | 28 | `index.tsx.SearchedResultsTab()` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/index.tsx#L15:97` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-49 | 28 | `fotoPanelModelHelpers.ts.buildFotoPanelModelApi(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/fotoPanelModelHelpers.ts#L86:123` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-50 | 28 | `verify-regio-apis.ts.testDatabaseQueries()` | `backend/scripts/verify-regio-apis.ts#L48:76` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-51 | 28 | `useDrawingToolLifecycle.ts.useDrawingToolStep1Lifecycle(any)` | `src/Components/Voorbereiding/DrawingTool/helpers/useDrawingToolLifecycle.ts#L36:70` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-52 | 28 | `useTimesliderItemImages.ts.useTimesliderItemImages(any)` | `src/Components/TimesliderItemDetailPage/hooks/useTimesliderItemImages.ts#L39:77` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-53 | 28 | `index.tsx.StepNo()` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/AddToPlan/StepNo/index.tsx#L10:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-54 | 28 | `SelectedTab.tsx.SelectedTab()` | `src/Components/HomePage/Body/Left/Common/BottomTabs/SelectedTab.tsx#L9:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-55 | 28 | `createPoint.ts.createPoint(Request,Response)` | `backend/src/routes/points/createPoint.ts#L11:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-56 | 28 | `HeadButtonsTimeslider.tsx.HeadButtonsTimeslider()` | `src/Components/HomePage/Head/HeadButtonsTimeslider.tsx#L13:80` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-57 | 28 | `useMapViewBottomPanel.ts.useMapViewBottomPanel(any)` | `src/Components/HomePage/Body/MapViewComp/useMapViewBottomPanel.ts#L7:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-58 | 28 | `handleSubmit()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/ChangePoint/index.tsx#L39:58` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-59 | 28 | `prepareAddPointsToPlanPayload.ts.prepareAddPointsToPlanPayload(SubmitAddPointsToPlanInput)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/helpers/prepareAddPointsToPlanPayload.ts#L9:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-60 | 28 | `useEditFormController.ts.useEditFormController(Geometry,void)` | `src/Components/HomePageTools/EditGeometry/EditForm/useEditFormController.ts#L10:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-61 | 27 | `Buttons.tsx.Buttons(any)` | `src/Components/Voorbereiding/FlightPlan/Steps/Step3/Buttons.tsx#L29:59` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-62 | 27 | `finishedPlansQuerySql.ts.buildSingleFinishedFlightPlanSelect(string)` | `backend/src/helpers/repositories/finishedPlansQuerySql.ts#L103:129` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-63 | 27 | `submitStep2()` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/Buttons.tsx#L87:143` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-64 | 27 | `getAllUsers.ts.getAllUsers(Request)` | `backend/src/routes/keycloak/management/users/getAllUsers.ts#L10:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-65 | 27 | `usePointsListActions.ts.usePointsListActions()` | `src/Components/HomePage/Body/Bottom/ClickedTableFunctions/usePointsListActions.ts#L14:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-66 | 27 | `useRemoveFlightPlanModel.ts.useRemoveFlightPlanModel()` | `src/Components/Voorbereiding/RemoveFlightPlan/useRemoveFlightPlanModel.ts#L10:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-67 | 27 | `buildTimesliderPageShell.ts.buildTimesliderPageShell(BuildTimesliderPageShellInput)` | `src/Components/TimesliderItemDetailPage/builders/buildTimesliderPageShell.ts#L13:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-68 | 27 | `useAddPointToPlanSelections.ts.useAddPointToPlanSelections()` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/useAddPointToPlanSelections.ts#L10:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-69 | 27 | `FetchClientRoleNamesForUserInput.fetchClientRoleDefinitions(string,string)` | `backend/src/routes/keycloak/management/users/keycloakAdminClient.ts#L86:121` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-70 | 27 | `connectRedisClient.ts.connectRedisClient(string\|undefined)` | `backend/src/helpers/redis/connectRedisClient.ts#L3:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-71 | 27 | `useDebouncedRedPointFromInputs.ts.useDebouncedRedPointFromInputs(any)` | `src/Components/HomePageTools/EditGeometry/EditForm/EditGeometryPointPanel/useDebouncedRedPointFromInputs.ts#L7:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-72 | 27 | `Step1.tsx.Step1(Step1Props)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/Step1.tsx#L13:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-73 | 27 | `pdfReportTables.ts.addCoordinatesTable(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportTables.ts#L77:106` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-74 | 27 | `useGeometryGraphicsEffects.ts.useGeometryGraphicsRendering(any)` | `src/Components/HomePage/hooks/features/useGeometryGraphicsEffects.ts#L62:98` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-75 | 27 | `flightPlanFormDefaults.ts` | `src/hooks/zustand/shared/flightPlanFormDefaults.ts#L1:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-76 | 27 | `submitStep1()` | `src/Components/Voorbereiding/ViewPlan/Steps/Step1/Buttons.tsx#L36:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-77 | 27 | `LegendSectionLayoutCore.tsx.LegendSectionLayoutView(LegendSectionLayoutProps)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/LegendSectionLayoutCore.tsx#L134:160` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-78 | 27 | `useEditGeometryModel.ts.useEditGeometryModel()` | `src/Components/HomePageTools/EditGeometry/useEditGeometryModel.ts#L13:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-79 | 27 | `createEmail.ts.createEmail(Request,Response)` | `backend/src/routes/emails/createEmail.ts#L6:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-80 | 26 | `commandGuard.ts.queueDeviceCommandWhenIdle(QueueDeviceCommandInput)` | `backend/src/routes/devices-updates/commandGuard.ts#L17:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-81 | 26 | `processImportedRows(string[])` | `src/Components/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx#L75:102` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-82 | 26 | `usePointsViewInteractions.ts.usePointsViewInteractions(any)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/usePointsViewInteractions.ts#L8:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-83 | 26 | `useEditFormState.ts.useEditFormDraftState(Geometry)` | `src/Components/HomePageTools/EditGeometry/EditForm/useEditFormState.ts#L16:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-84 | 26 | `useEditPointCoordSyncEffects.ts.useSyncEditPointFromSelection(FinishedPointType\|null,CoordState)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordSyncEffects.ts#L11:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-85 | 26 | `useResetPasswordModel.ts.useResetPasswordModel()` | `src/Components/DashboardPage/ResetPassword/useResetPasswordModel.ts#L5:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-86 | 26 | `useUploadZip.ts.useUploadZip()` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/useUploadZip.ts#L19:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-87 | 26 | `toolsTabsPart1.ts` | `src/Components/HomePage/Head/headTabDefinitions/toolsTabsPart1.ts#L1:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-88 | 26 | `getRedisClient.ts.getRedisClient()` | `backend/src/helpers/redis/getRedisClient.ts#L40:68` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-89 | 26 | `nabewerkingTabs.ts` | `src/Components/HomePage/Head/headTabDefinitions/nabewerkingTabs.ts#L1:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-90 | 26 | `deleteGeometry.ts.deleteGeometry(Request,Response)` | `backend/src/routes/geometries/deleteGeometry.ts#L11:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-91 | 26 | `getFlightPlanById.ts.getFlightPlanById(Request,Response)` | `backend/src/routes/flightPlans/getFlightPlanById.ts#L5:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-92 | 26 | `getSingleGeometry.ts.getSingleGeometry(Request,Response)` | `backend/src/routes/geometries/getSingleGeometry.ts#L7:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-93 | 26 | `editGeometryActionHandlers.ts.deleteSelectedGeometry(DeleteSelectedGeometryInput)` | `src/Components/HomePageTools/EditGeometry/editGeometryActionHandlers.ts#L130:157` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-94 | 26 | `mapImage.ts` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/mapImage.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-95 | 26 | `Buttons.tsx.Buttons(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/Steps/Step3/Buttons.tsx#L15:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-96 | 26 | `SinglePoint.tsx.SinglePoint(any)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/SinglePoint.tsx#L10:14` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-97 | 26 | `mapViewConfiguration.ts.createConfiguredMapView(any)` | `src/helpers/ArcGISHelpers/mapViewConfiguration.ts#L6:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-98 | 26 | `useTimesliderFlightPlans.ts.useTimesliderFlightPlans()` | `src/Components/HomePage/Body/Left/TimeSlider/useTimesliderFlightPlans.ts#L10:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-99 | 26 | `runFlightPlanRegioCases.ts.runFlightPlanRegioCases(any)` | `backend/scripts/runFlightPlanRegioCases.ts#L7:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-100 | 26 | `SinglePlan.tsx.SinglePlan(any)` | `src/Components/Voorbereiding/RemoveFlightPlan/SinglePlan.tsx#L12:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-101 | 26 | `syncSelectedPlanPathLayer.ts` | `src/Components/HomePage/hooks/hover-click-handlers/syncSelectedPlanPathLayer.ts#L1:17` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-102 | 25 | `fetchClientRoleNamesHelpers.ts.fetchRoleNamesForOneClient(any)` | `backend/src/routes/keycloak/management/users/fetchClientRoleNamesHelpers.ts#L3:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-103 | 25 | `enrichedPointStateActions.ts.createEnrichedPointActions(any)` | `src/hooks/zustand/enrichedPointStateActions.ts#L7:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-104 | 25 | `toggleStarPlan(FlightPlanType)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/FlightPlans/FlightPlansList/List.tsx#L62:90` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-105 | 25 | `useEditPointMapClick.ts.useEditPointMapClick(EditPointMapClickInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointMapClick.ts#L6:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-106 | 25 | `upsertRegisteredDevice.ts.updateExistingDevice(RegisterDeviceInput,string)` | `backend/src/routes/devices-updates/upsertRegisteredDevice.ts#L13:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-107 | 25 | `handleSubmit()` | `src/Components/Voorbereiding/DrawingTool/Step2/Buttons.tsx#L36:61` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-108 | 25 | `logQueue.ts.initializeLogQueue(SendLogs)` | `src/hooks/logging/logQueue.ts#L14:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-109 | 25 | `useResultTabTableViewCore.ts.useResultTabTableView()` | `src/Components/HomePage/hooks/resultTab/useResultTabTableViewCore.ts#L8:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-110 | 25 | `useDrawingStore.ts` | `src/hooks/zustand/useDrawingStore.ts#L1:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-111 | 25 | `mapGraphicsLayers.ts.addAndOrderMapGraphicsLayers(any)` | `src/helpers/ArcGISHelpers/mapGraphicsLayers.ts#L17:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-112 | 25 | `SinglePoint.tsx.SinglePoint(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/SinglePoint.tsx#L7:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-113 | 25 | `registerApplicationRoutes.ts.registerApplicationRoutes(Express,Router)` | `backend/src/configure/registerApplicationRoutes.ts#L26:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-114 | 25 | `handleSubmit()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/Buttons.tsx#L37:58` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-115 | 25 | `finishedPlansTimesliderQuery.ts.buildTimesliderPlanImagesQuery(BuildTimesliderPlanImagesQueryOptions)` | `backend/src/helpers/repositories/finishedPlansTimesliderQuery.ts#L21:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-116 | 25 | `zoomMapToPointsTable.ts.zoomMapToPointsTable(any)` | `src/Components/HomePage/Body/Bottom/ClickedTableFunctions/zoomMapToPointsTable.ts#L5:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-117 | 25 | `notLoggedInBannerTheme.ts.resolveLoginBannerTheme(any)` | `src/Components/HomePage/Body/Common/notLoggedInBannerTheme.ts#L4:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-118 | 25 | `useFeatureLayerPopupCore.ts.useFeatureLayerPopup()` | `src/Components/HomePage/hooks/hover-click-handlers/useFeatureLayerPopupCore.ts#L13:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-119 | 25 | `shapefileExportCore.ts.exportFlightPlansShapefile(FlightPlanType[])` | `src/Components/HomePage/helpers/tableExports/shapefileExportCore.ts#L19:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-120 | 25 | `processGeometry.ts.processGeometry(ProcessGeometryParams)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/processGeometry.ts#L26:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-121 | 25 | `useFinishedPlansState.ts` | `src/Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState.ts#L1:75` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-122 | 25 | `BuildGeometryPointFieldsInput.buildGeometryPointFields(BuildGeometryPointFieldsInput)` | `src/Components/Voorbereiding/DrawingTool/helpers/toGeometryPointPayload.ts#L23:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-123 | 25 | `useSelectFromSourceGraphicsEffects.ts.useSelectFromSourceGraphicsLifecycle(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceGraphicsEffects.ts#L16:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-124 | 25 | `logoutHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth2/logoutHandler.ts#L5:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-125 | 25 | `usePopupMapClickEffect.ts.usePopupMapClickEffect()` | `src/Components/HomePage/hooks/popUpModal/usePopupMapClickEffect.ts#L9:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-126 | 25 | `useViewPlanController.ts.useViewPlanController()` | `src/Components/Voorbereiding/ViewPlan/useViewPlanController.ts#L8:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-127 | 24 | `useLegendLayers.ts.useLegendLayers(LegendLayerDefinition[],UseLegendLayersOptions)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/helpers/useLegendLayers.ts#L23:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-128 | 24 | `SplitFlightPlanListInput.splitFlightPlanListInput(FlightPlanListRawInput)` | `backend/src/helpers/queries/flight-plans/fetchFlightPlanListHelpers.ts#L44:69` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-129 | 24 | `loginUser.ts.loginUser(Request,Response)` | `backend/src/routes/auth/loginUser.ts#L4:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-130 | 24 | `DefaultPointItem.tsx.DefaultPointItem(PointItemViewProps,any)` | `src/Components/HomePage/Body/Left/Common/DefaultPointItem.tsx#L4:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-131 | 24 | `overigLayerSpecsPartA.tsx` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Overig/overigLayerSpecsPartA.tsx#L1:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-132 | 24 | `useViewPlanStepMap.ts.useViewPlanStepMap(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/useViewPlanStepMap.ts#L15:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-133 | 24 | `keycloakUserLookup.ts.userHasOtpCredential(Request,string)` | `backend/src/routes/auth2/keycloakUserLookup.ts#L44:74` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-134 | 24 | `useFeatureLayerLabels.ts.useFeatureLayerLabels()` | `src/Components/HomePage/hooks/hover-click-handlers/useFeatureLayerLabels.ts#L6:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-135 | 24 | `pdfReportMapPages.ts.imageDataToJpegDataUrl(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportMapPages.ts#L13:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-136 | 24 | `applyCoordsFromMapClick.ts.applyCoordsFromMapClick(ApplyEditPointMapClickInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/applyCoordsFromMapClick.ts#L5:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-137 | 24 | `placeBluePointGraphics.ts` | `src/helpers/ArcGISHelpers/placeBluePointGraphics.ts#L1:13` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-138 | 24 | `Step2Sub2.tsx.Step2Sub2(EditPointStep2Sub2Props)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/Step2Sub2.tsx#L14:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-139 | 24 | `parseTimesliderImageQuery.ts.parseTimesliderImageQuery(URLSearchParams)` | `src/Components/TimesliderItemDetailPage/query/parseTimesliderImageQuery.ts#L53:82` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-140 | 24 | `ArcGISAuthProvider.tsx.ArcGISAuthProvider(Props)` | `src/Components/Common/ArcGISAuthProvider.tsx#L8:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-141 | 24 | `index.tsx.Form(EditObservationFormProps)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/index.tsx#L15:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-142 | 24 | `useGeometryGraphicsEffects.ts` | `src/Components/HomePage/hooks/features/useGeometryGraphicsEffects.ts#L1:7` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-143 | 24 | `classifyStep2OtpLoginFailure.ts.classifyStep2OtpLoginFailure(unknown,ClassifyStep2DebugContext)` | `backend/src/routes/auth2/classifyStep2OtpLoginFailure.ts#L47:76` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-144 | 24 | `submitCollectedFlightPlanCreate.ts.submitCollectedFlightPlanCreate(SubmitCollectedFlightPlanCreateInput)` | `src/Components/HomePage/hooks/flightPlan/submitCollectedFlightPlanCreate.ts#L31:60` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-145 | 24 | `useEditPointFormMapClick.ts.useEditPointFormMapClick(any)` | `src/Components/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/useEditPointFormMapClick.ts#L7:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-146 | 24 | `loginHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth/authKeycloak/loginHandler.ts#L11:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-147 | 24 | `useTimesliderState.ts` | `src/hooks/zustand/ui/useTimesliderState.ts#L1:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-148 | 24 | `fetchConstLookup.ts.fetchConstLookup(FetchConstLookupInput)` | `backend/src/helpers/queries/consts/fetchConstLookup.ts#L14:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-149 | 24 | `ImageGallery.tsx.ImageGallery(any)` | `src/Components/HomePage/Body/Common/ImageGallery.tsx#L20:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-150 | 24 | `index.tsx.Step2()` | `src/Components/Voorbereiding/FlightPlan/Steps/Step2/index.tsx#L22:98` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-151 | 24 | `index.tsx.SelectFromSource(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx#L16:77` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-152 | 24 | `handleBuffer()` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Functions/PointsBuffer.tsx#L21:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-153 | 24 | `popupSelection.ts.openPopupForClickedPoint(any)` | `src/Components/HomePage/hooks/popUpModal/popupSelection.ts#L16:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-154 | 24 | `index.tsx.EditPoint()` | `src/Components/Voorbereiding/ViewPlan/Steps/EditPoint/index.tsx#L7:61` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-155 | 24 | `useEditFormState.ts.useEditFormState(Geometry)` | `src/Components/HomePageTools/EditGeometry/EditForm/useEditFormState.ts#L43:66` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-156 | 24 | `createPointFromImport.ts.createPointFromImport(Request,Response)` | `backend/src/routes/points/createPointFromImport.ts#L11:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-157 | 24 | `index.ts` | `src/hooks/zustand/ui/index.ts#L5:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-158 | 24 | `submitViewPlanStep2.ts.buildViewPlanStep2SubmitContext(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/submitViewPlanStep2.ts#L19:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-159 | 24 | `index.tsx.Step3(any)` | `src/Components/Voorbereiding/FlightPlan/Steps/Step3/index.tsx#L20:102` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-160 | 24 | `loadUsers()` | `src/Components/DashboardPage/AllUsersTable/index.tsx#L45:72` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-161 | 24 | `getAttachmentsPlanSinglePoint.ts.getAttachmentsPlanSinglePoint(Request,Response)` | `backend/src/routes/finished_plans/getAttachmentsPlanSinglePoint.ts#L4:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-162 | 24 | `subscribeMapHoverHighlight.ts.subscribeMapHoverHighlight(MapHoverLayers)` | `src/Components/HomePage/Body/MapViewComp/subscribeMapHoverHighlight.ts#L5:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-163 | 24 | `deletePointStateCore.ts.createDeletePointSetters(any)` | `src/Components/HomePage/hooks/zustand/tools/deletePointStateCore.ts#L45:68` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-164 | 23 | `spoedReportSendHelpers.ts.renderSpoedPdfBuffer(ValidatedSpoed)` | `backend/src/routes/emails/spoedReportSendHelpers.ts#L23:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-165 | 23 | `Buttons.tsx.Buttons()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/Buttons.tsx#L16:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-166 | 23 | `SaveEditGeometryInput.saveEditGeometry(SaveEditGeometryInput)` | `src/Components/HomePageTools/EditGeometry/editGeometryActionHandlers.ts#L62:84` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-167 | 23 | `nnederlandLayerSpecsPart3a.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart3a.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-168 | 23 | `staleCommandSql.ts.buildStaleCommandUpdateSql(any)` | `backend/src/routes/devices-updates/staleCommandSql.ts#L9:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-169 | 23 | `nnederlandLayerSpecsPart1c.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart1c.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-170 | 23 | `selectedPointDetailsData.ts.buildSelectedPointDetails(BuildSelectedPointDetailsInput)` | `src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails/selectedPointDetailsData.ts#L19:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-171 | 23 | `nnederlandLayerSpecsPart2c.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart2c.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-172 | 23 | `handleSubmit()` | `src/Components/Voorbereiding/ViewPlan/Steps/EditPoint/Buttons/Submit.tsx#L20:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-173 | 23 | `useViewPlanFilteredPlans.ts.useViewPlanFilteredPlans(any)` | `src/Components/Voorbereiding/ViewPlan/useViewPlanFilteredPlans.ts#L5:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-174 | 23 | `nnederlandLayerSpecsPart2a.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart2a.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-175 | 23 | `handleToggle(React.ChangeEvent<HTMLInputElement>)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/LayerItem.tsx#L42:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-176 | 23 | `nnederlandLayerSpecsPart2b.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart2b.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-177 | 23 | `runReturningUpdate.ts.executeReturningUpdate(any)` | `backend/src/helpers/http/runReturningUpdate.ts#L35:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-178 | 23 | `featureLayerLabelsSync.ts.attachFeatureLayerLabelSync(any)` | `src/Components/HomePage/hooks/hover-click-handlers/featureLayerLabelsSync.ts#L6:10` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-179 | 23 | `useStepContentHooks.ts.useStepContentHooks(any)` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Common/useStepContentHooks.ts#L11:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-180 | 23 | `BottomTabButton.tsx.BottomTabButton(any)` | `src/Components/HomePage/Body/Left/Common/BottomTabs/BottomTabButton.tsx#L7:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-181 | 23 | `nnederlandLayerSpecsPart3b.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart3b.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-182 | 23 | `timesliderPlanImagesParse.ts.parseTimesliderPlanImagesRequest(any)` | `backend/src/helpers/queries/timeslider/timesliderPlanImagesParse.ts#L15:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-183 | 23 | `bufferPointsOnLayerCore.ts.bufferPointsOnLayer(BufferPointsOnLayerInput)` | `src/helpers/ArcGISHelpers/bufferPointsOnLayerCore.ts#L46:70` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-184 | 23 | `usePathLoadingReady.ts.usePathLoadingReady(any)` | `src/Components/HomePage/hooks/hover-click-handlers/usePathLoadingReady.ts#L3:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-185 | 23 | `buildTabHeaderLabelMap.ts.buildTabHeaderLabelMap(TabHeaderContent)` | `src/Components/HomePage/Body/Left/Common/TabHeader/buildTabHeaderLabelMap.ts#L10:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-186 | 23 | `flightPlanFormFields.ts` | `src/hooks/zustand/shared/flightPlanFormFields.ts#L1:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-187 | 23 | `exportFlightPathZip.ts.buildFlightPathGeoJson(FinishedFlightPlanType)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/VliegrouteExporteren/exportFlightPathZip.ts#L7:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-188 | 23 | `fetchAndRegisterArcGisToken.ts.fetchAndRegisterArcGisToken(string,string[])` | `src/helpers/tokens/fetchAndRegisterArcGisToken.ts#L12:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-189 | 23 | `buildFlightPlanQuery.ts.buildFlightPlanQuery(BuildFlightPlanQueryOptions)` | `backend/src/helpers/queries/flight-plans/buildFlightPlanQuery.ts#L10:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-190 | 23 | `handleDelete()` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/Buttons.tsx#L24:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-191 | 23 | `FetchFlightPlanListInput.fetchFlightPlanList(FetchFlightPlanListInput)` | `backend/src/helpers/queries/flight-plans/fetchFlightPlanList.ts#L28:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-192 | 23 | `index.tsx.EditPointCoordinates(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/index.tsx#L8:63` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-193 | 23 | `buildFlightPlanCreateAttributesCore.ts.buildFlightPlanCreateAttributes(BuildFlightPlanCreateAttributesInput)` | `src/Components/HomePage/hooks/flightPlan/buildFlightPlanCreateAttributesCore.ts#L18:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-194 | 23 | `updateGeometry.ts.updateGeometry(Request,Response)` | `backend/src/routes/geometries/updateGeometry.ts#L8:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-195 | 23 | `pages.ts` | `src/Components/HomePage/Head/headTabDefinitions/pages.ts#L1:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-196 | 23 | `drawYellowPlanGraphics.ts.drawYellowGeometries(Geometry[],__esri.GraphicsLayer\|null)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/helpers/drawYellowPlanGraphics.ts#L31:60` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-197 | 23 | `nnederlandLayerSpecsPart1b.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart1b.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-198 | 23 | `index.tsx.ListPointFunctions(any)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Functions/ListPointsFunctions/index.tsx#L24:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-199 | 23 | `useEntityPlanImages.ts.useEntityPlanImages(EntityPlanImagesInput)` | `src/api-hooks/planImages/useEntityPlanImages.ts#L35:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-200 | 23 | `promptPasswordAndCopyDownloadLink.ts.promptPasswordAndCopyDownloadLink(any)` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/promptPasswordAndCopyDownloadLink.ts#L4:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-201 | 23 | `index.ts` | `backend/src/routes/emails/index.ts#L1:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-202 | 23 | `generatePdfReport.ts.generatePdfReport(GeneratePdfReportInput)` | `src/Components/Nabewerking/CreateReport/helpers/generatePdfReport.ts#L29:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-203 | 23 | `nnederlandLayerSpecsPart3d.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart3d.ts#L1:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-204 | 22 | `usePointsViewLayoutController.ts.usePointsViewLayoutController(any)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/usePointsViewLayoutController.ts#L5:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-205 | 22 | `keycloakUserApi.ts.createKeycloakUser(any)` | `src/Components/DashboardPage/shared/keycloakUserApi.ts#L69:96` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-206 | 22 | `mapPointerHoverHandler.ts.createMapPointerHoverHandler(MapPointerHoverHandlerInput)` | `src/Components/HomePage/Body/MapViewComp/mapPointerHoverHandler.ts#L41:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-207 | 22 | `useViewPlanState.ts` | `src/Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState.ts#L1:76` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-208 | 22 | `useEditPointCoordState.ts.useEditPointCoordState()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordState.ts#L4:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-209 | 22 | `useMapClickToUpdateCoordinates.ts.useMapClickToUpdateCoordinates(any)` | `src/Components/HomePageTools/EditGeometry/EditForm/EditGeometryPointPanel/useMapClickToUpdateCoordinates.ts#L10:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-210 | 22 | `upsertRegisteredDevice.ts.insertNewDevice(RegisterDeviceInput)` | `backend/src/routes/devices-updates/upsertRegisteredDevice.ts#L43:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-211 | 22 | `resolveUploadedAttachment.ts.queryLatestAttachmentResult(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/resolveUploadedAttachment.ts#L8:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-212 | 22 | `pdfReportTables.ts.addGeneralInfoTable(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportTables.ts#L50:75` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-213 | 22 | `timesliderPageStatus.ts` | `src/Components/TimesliderItemDetailPage/builders/timesliderPageStatus.ts#L46:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-214 | 22 | `arcgisOAuthTokenPost.ts.postArcgisOAuthToken(ResolvedArcgisTokenConfig)` | `backend/src/services/arcgisOAuthTokenPost.ts#L4:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-215 | 22 | `useNotLoggedInBanner.ts.useNotLoggedInBanner()` | `src/Components/HomePage/Body/Common/useNotLoggedInBanner.ts#L15:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-216 | 22 | `createKeycloakUser.ts.clearKeycloakRequiredActions(Request,string)` | `backend/src/routes/keycloak/management/users/createKeycloakUser.ts#L89:112` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-217 | 22 | `Buttons.tsx.Buttons(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/Buttons.tsx#L31:86` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-218 | 22 | `SinglePoints.tsx.SinglePoint(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/ChangePoint/SinglePoints.tsx#L7:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-219 | 22 | `FlightPlanStandardFields.tsx.pickFlightPlanFormFields(FlightPlanFormFieldValues&FlightPlanFormFieldSetters)` | `src/Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields.tsx#L11:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-220 | 22 | `useReuseFlightPlan.ts` | `src/hooks/zustand/useReuseFlightPlan.ts#L1:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-221 | 22 | `useEditPointCoordinateStores.ts.useEditPointCoordinateStores()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinateStores.ts#L5:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-222 | 22 | `respondToVerifyGrantFailure.ts.respondToVerifyGrantFailure(any)` | `backend/src/routes/auth2/respondToVerifyGrantFailure.ts#L55:85` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-223 | 22 | `pointGraphicFactoryCore.ts.createPointGraphic(PointData,CreatePointGraphicOptions)` | `src/helpers/ArcGISHelpers/pointGraphicFactoryCore.ts#L10:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-224 | 22 | `usePathPointHandlerClick.ts.usePathPointHandlerClick()` | `src/Components/HomePage/hooks/hover-click-handlers/usePathPointHandlerClick.ts#L43:68` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-225 | 22 | `syncAttachmentsInPlan.ts.syncGeometryAttachmentsInPlan(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/syncAttachmentsInPlan.ts#L59:89` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-226 | 22 | `mapGetacDeviceRow.ts.mapGetacDeviceRow(Record<string, unknown>)` | `backend/src/routes/devices-updates/mapGetacDeviceRow.ts#L11:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-227 | 22 | `runFotoAttachmentDelete.ts.runFotoAttachmentDelete(FotoAttachmentDeleteInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/runFotoAttachmentDelete.ts#L8:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-228 | 22 | `removePointSuccess.ts.applyRemovePointSuccessState(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/EditPoint/Buttons/removePointSuccess.ts#L54:92` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-229 | 22 | `buildHtml.ts.htmlDiv(string,string)` | `backend/src/helpers/html/buildHtml.ts#L15:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-230 | 22 | `buildAndSendSpoedReport.ts.buildAndSendSpoedReport(any)` | `backend/src/routes/emails/buildAndSendSpoedReport.ts#L13:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-231 | 22 | `deletePoint.ts.deletePoint(Request,Response)` | `backend/src/routes/points/deletePoint.ts#L10:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-232 | 22 | `applyUploadedAttachmentSuccess.ts.buildAttachmentsAfterUpload(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/applyUploadedAttachmentSuccess.ts#L7:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-233 | 22 | `SelectedPlanImagesPanel.tsx.SelectedPlanImagesPanel(any)` | `src/Components/HomePage/Body/Right/SelectedPlansPointsList/Images/SelectedPlanImagesPanel.tsx#L44:76` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-234 | 22 | `useSelectFromSourceQuery.ts.useSelectFromSourceQuery(Source)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceQuery.ts#L8:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-235 | 22 | `buildPathPointGraphics.ts.buildPathPointGraphics(any)` | `src/Components/HomePage/hooks/hover-click-handlers/buildPathPointGraphics.ts#L7:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-236 | 22 | `removePointSuccess.ts.buildRemainingPlanPointGraphics(FlightPlanType["points"])` | `src/Components/Voorbereiding/ViewPlan/Steps/EditPoint/Buttons/removePointSuccess.ts#L10:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-237 | 22 | `timesliderGeometryHighlightFactory.ts.createPlanGeometryHighlightGraphic(any)` | `src/helpers/timeslider/timesliderGeometryHighlightFactory.ts#L41:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-238 | 22 | `EditFormBody.tsx` | `src/Components/HomePageTools/EditGeometry/EditForm/EditFormBody.tsx#L1:9` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-239 | 22 | `getPoints.ts.getPoints(Request,Response)` | `backend/src/routes/points/getPoints.ts#L6:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-240 | 22 | `flightPlansRepo.ts.buildFlightPlanInsertParams(FlightPlanBodySource)` | `backend/src/helpers/repositories/flightPlansRepo.ts#L53:77` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-241 | 22 | `buildFinishedPlanQuery.ts.buildFinishedPlansWithPointsQuery(BuildFinishedPlansQueryOptions)` | `backend/src/helpers/queries/finished-plans/buildFinishedPlanQuery.ts#L18:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-242 | 22 | `syncBluePointGraphicsCore.ts` | `src/helpers/ArcGISHelpers/syncBluePointGraphicsCore.ts#L1:3` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-243 | 22 | `nnederlandLayerSpecsPart1a.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart1a.ts#L1:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-244 | 22 | `useTimesliderQueryContext.ts.buildQueryFields(ParsedTimesliderQuery)` | `src/Components/TimesliderItemDetailPage/hooks/useTimesliderQueryContext.ts#L9:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-245 | 22 | `useTemplateSelectionFilters.ts.useTemplateSelectionFilters(any)` | `src/Components/Voorbereiding/TemplateFlight/Steps/useTemplateSelectionFilters.ts#L6:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-246 | 22 | `Buttons.tsx.Buttons(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step1/Buttons.tsx#L10:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-247 | 22 | `planBoundingBoxSymbolsStar.ts` | `src/helpers/ArcGISHelpers/planBoundingBoxSymbolsStar.ts#L1:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-248 | 22 | `usePointGraphicsEffects.ts.usePointGraphicsRendering(any)` | `src/Components/HomePage/hooks/features/usePointGraphicsEffects.ts#L48:77` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-249 | 22 | `assembleTimesliderPageView.ts.assembleTimesliderPageView(BuildTimesliderPageViewInput)` | `src/Components/TimesliderItemDetailPage/builders/assembleTimesliderPageView.ts#L9:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-250 | 22 | `useStepContentMapSync.ts.useStepContentMapSync(PointData[])` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Common/useStepContentMapSync.ts#L11:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-251 | 22 | `timesliderHighlightGraphics.ts.addPlanPointHighlights(__esri.GraphicsLayer,FinishedFlightPlanType)` | `src/helpers/timeslider/timesliderHighlightGraphics.ts#L18:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-252 | 22 | `useWizardFilterStep2Buttons.ts.useWizardFilterStep2Buttons(any)` | `src/Components/Voorbereiding/common/useWizardFilterStep2Buttons.ts#L17:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-253 | 22 | `flightPlansRepo.ts.buildFlightPlanInsertSql()` | `backend/src/helpers/repositories/flightPlansRepo.ts#L22:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-254 | 22 | `applyGeometrySaveSuccess.ts.applyGeometrySaveSuccess(any)` | `src/Components/HomePageTools/EditGeometry/applyGeometrySaveSuccess.ts#L7:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-255 | 22 | `timesliderFlightPlanEffects.ts.useLoadTimesliderPlans(any)` | `src/Components/HomePage/Body/Left/TimeSlider/timesliderFlightPlanEffects.ts#L27:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-256 | 22 | `flightPlansByPointQuery.ts` | `backend/src/helpers/repositories/flightPlansByPointQuery.ts#L1:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-257 | 22 | `ensureFreshSessionHelpers.ts.refreshSessionTokens(Request)` | `backend/src/helpers/auth/ensureFreshSessionHelpers.ts#L17:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-258 | 22 | `buildAddPointResetForm.ts.buildAddPointResetForm(Stores)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/buildAddPointResetForm.ts#L6:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-259 | 21 | `verifyRegioPointsGeometries.ts.runGeometriesRegioCheck(any)` | `backend/scripts/verifyRegioPointsGeometries.ts#L54:78` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-260 | 21 | `applyGeometryCommentUpdate.ts.applyGeometryCommentSuccess(ApplyGeometryCommentUpdateInput,FinishedPointType[])` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/applyGeometryCommentUpdate.ts#L50:75` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-261 | 21 | `handleCopyLink()` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/useCopyLink.ts#L18:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-262 | 21 | `Images.tsx.Images(any)` | `src/Components/Voorbereiding/SelectedPoint/ViewPlans/Images.tsx#L9:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-263 | 21 | `useStepContentDataInit.ts.useStepContentDataInit(any)` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Common/useStepContentDataInit.ts#L10:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-264 | 21 | `Sidebar.tsx.Sidebar()` | `src/Components/DashboardPage/Sidebar.tsx#L3:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-265 | 21 | `FinishedPlanWriter.markFlightPlanFinished()` | `backend/src/helpers/finished-plans/createFinishedPlanDb.ts#L149:170` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-266 | 21 | `geometryNamedSymbolsB.ts` | `src/helpers/ArcGISHelpers/geometryNamedSymbolsB.ts#L1:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-267 | 21 | `syncTableTabGraphics.ts.syncFlightPlansTabGraphics(any)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/syncTableTabGraphics.ts#L47:73` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-268 | 21 | `useStep2ButtonsModel.ts.useStep2ButtonsModel()` | `src/Components/Nabewerking/CreateReport/Steps/Step2/useStep2ButtonsModel.ts#L8:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-269 | 21 | `syncTableTabGraphics.ts` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/syncTableTabGraphics.ts#L1:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-270 | 21 | `createFinishedPlan.ts.createFinishedPlan(Request,Response)` | `backend/src/routes/finished_plans/createFinishedPlan.ts#L11:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-271 | 21 | `DropDown.tsx.DropDown(any)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/Points/DropDown.tsx#L24:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-272 | 21 | `handleSubmit()` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/Buttons.tsx#L28:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-273 | 21 | `updateFinishedPointAttachmentsHelpers.ts.commitAttachmentUpdate(any)` | `backend/src/routes/finished_plans/updateFinishedPointAttachmentsHelpers.ts#L36:65` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-274 | 21 | `deletePointStep1FieldProps.ts.deletePointStep1FieldProps(Model)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/deletePointStep1FieldProps.ts#L5:9` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-275 | 21 | `MapComp.tsx.MapComp(any)` | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx#L12:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-276 | 21 | `CommonTabBtn.tsx.CommonTabBtn(any)` | `src/Components/HomePage/Head/Common/CommonTabBtn.tsx#L6:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-277 | 21 | `createUser.ts.createUser(Request,Response)` | `backend/src/routes/users/createUser.ts#L17:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-278 | 21 | `DropDown.tsx.DropDown(any)` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/FlightPlans/FlightPlansList/DropDown.tsx#L24:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-279 | 21 | `templateFlightWizardCleanup.ts.runTemplateFlightCancelCleanup(any)` | `src/Components/Voorbereiding/TemplateFlight/helpers/templateFlightWizardCleanup.ts#L58:90` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-280 | 21 | `usePointsViewLayoutAndGraphics.ts.usePointsViewLayoutAndGraphics(any)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/usePointsViewLayoutAndGraphics.ts#L7:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-281 | 21 | `createGeometryGraphicInternal.ts.createGeometryGraphic(BaseGeometryData,CreateGeometryGraphicOptions)` | `src/helpers/ArcGISHelpers/createGeometryGraphicInternal.ts#L14:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-282 | 21 | `buildCoordinateSyncPatchCore.ts.buildCoordinateSyncPatch(any)` | `src/helpers/geo/buildCoordinateSyncPatchCore.ts#L11:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-283 | 21 | `processPoint.ts.processPoint(ProcessPointParams)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/processPoint.ts#L9:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-284 | 21 | `handleUpdate()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/index.tsx#L41:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-285 | 21 | `handlePathPointMapClick.ts.handlePathPointMapClick(any)` | `src/Components/HomePage/hooks/hover-click-handlers/handlePathPointMapClick.ts#L10:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-286 | 21 | `callbackHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth/authKeycloak/callbackHandler.ts#L7:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-287 | 21 | `useBasemapsListModel.ts.useBasemapsListModel(UsedPlace)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/useBasemapsListModel.ts#L18:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-288 | 21 | `ArcGISUserToken.ts` | `src/helpers/tokens/ArcGISUserToken.ts#L1:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-289 | 21 | `fotoPanelModelHelpers.ts.useAssembledFotoPanelModel(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/fotoPanelModelHelpers.ts#L126:158` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-290 | 21 | `useRenderGeometries.ts.useRenderGeometries()` | `src/Components/HomePage/hooks/features/useRenderGeometries.ts#L12:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-291 | 21 | `pointFields.ts` | `backend/src/helpers/queries/points/pointFields.ts#L1:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-292 | 21 | `arcgisAdminTokenPost.ts.postArcgisAdminToken(ResolvedArcgisTokenConfig)` | `backend/src/services/arcgisAdminTokenPost.ts#L9:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-293 | 21 | `featureLayerPopupClickHandler.ts.handleFeatureLayerMapClick(any)` | `src/Components/HomePage/hooks/hover-click-handlers/featureLayerPopupClickHandler.ts#L7:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-294 | 21 | `PointDetails.tsx.PointDetails(any)` | `src/Components/HomePage/Body/Left/Common/ResultTab/PointDetails.tsx#L5:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-295 | 21 | `index.tsx.AllUsersTable()` | `src/Components/DashboardPage/AllUsersTable/index.tsx#L29:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-296 | 21 | `usePopupBlockedGuard.ts.usePopupBlockedGuard()` | `src/Components/HomePage/hooks/popUpModal/usePopupBlockedGuard.ts#L7:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-297 | 21 | `toolsTabsPart2.ts` | `src/Components/HomePage/Head/headTabDefinitions/toolsTabsPart2.ts#L1:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-298 | 21 | `createUser.ts.handleCreateUser(Request,Response)` | `backend/src/routes/keycloak/management/users/createUser.ts#L8:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-299 | 21 | `useSelectFromSourceSelection.ts.useSelectFromSourceSelection(Set<number>)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceSelection.ts#L7:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-300 | 21 | `addPointToPlanPinHelpers.ts.syncAddPointToPlanPins(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/addPointToPlanPinHelpers.ts#L10:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-301 | 21 | `SingleGeometry.tsx.SingleGeometry(Props)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/SingleGeometry.tsx#L13:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-302 | 21 | `index.tsx.Step1(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step1/index.tsx#L68:110` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-303 | 21 | `Section2.tsx.Section2()` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Block1/Section2.tsx#L4:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-304 | 21 | `geometryNamedSymbolsA.ts` | `src/helpers/ArcGISHelpers/geometryNamedSymbolsA.ts#L1:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-305 | 21 | `editPointMapClickHelpers.ts.createEditPointClickHandler(any)` | `src/Components/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/editPointMapClickHelpers.ts#L41:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-306 | 21 | `fileDownload.ts.setPasswordHandler(any,any)` | `backend/src/routes/fileDownload.ts#L27:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-307 | 21 | `resolveUploadedAttachment.ts.resolveUploadedAttachment(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/resolveUploadedAttachment.ts#L36:61` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-308 | 21 | `useGeometryListMapClick.ts.useGeometryListMapClick(any)` | `src/Components/Voorbereiding/FlightPlan/Common/useGeometryListMapClick.ts#L7:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-309 | 21 | `createYellowBorder.ts.createYellowBorder(EnrichedPointType)` | `src/helpers/ArcGISHelpers/createYellowBorder.ts#L6:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-310 | 21 | `useBottomPanelState.ts.useBottomPanelState(boolean)` | `src/Components/HomePage/Body/MapViewComp/useBottomPanelState.ts#L4:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-311 | 21 | `updateFinishedPointAttachments.ts.updateFinishedPointAttachments(Request,Response)` | `backend/src/routes/finished_plans/updateFinishedPointAttachments.ts#L10:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-312 | 20 | `useImageMarkersOnMap.ts.useImageMarkersOnMap(UseImageMarkersOnMapInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useImageMarkersOnMap.ts#L14:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-313 | 20 | `keycloakUserApi.ts.updateKeycloakUserProfile(any)` | `src/Components/DashboardPage/shared/keycloakUserApi.ts#L21:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-314 | 20 | `BasemapWidget.tsx.BasemapWidget()` | `src/Components/HomePage/Body/MapViewComp/BasemapWidget.tsx#L16:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-315 | 20 | `createQuadrantGraphic.ts.createQuadrantGraphic(EnrichedPointType[])` | `src/helpers/ArcGISHelpers/createQuadrantGraphic.ts#L22:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-316 | 20 | `buildGeometryPointsFromDrawn.ts.buildGeometryPointsFromDrawn(GeometryPointContext,any)` | `src/Components/Voorbereiding/DrawingTool/helpers/buildGeometryPointsFromDrawn.ts#L28:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-317 | 20 | `featureLayerPopupFormatting.ts` | `src/Components/HomePage/Body/Common/FeatureLayerPopup/featureLayerPopupFormatting.ts#L1:16` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-318 | 20 | `updateUserRoles.ts.updateUserRoles(UpdateUserRolesInput)` | `backend/src/routes/keycloak/management/users/updateUserRoles.ts#L14:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-319 | 20 | `polygonDrawer.ts.startPolygonDrawer(any)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/polygonDrawer.ts#L72:101` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-320 | 20 | `reportPdfCommon.ts.fetchOverviewDetailImages(any)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/reportPdfCommon.ts#L39:62` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-321 | 20 | `Pages.tsx.Pages()` | `src/Components/HomePage/Head/Common/Pages.tsx#L8:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-322 | 20 | `pdfReportMapPages.ts.addMapPages(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportMapPages.ts#L44:68` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-323 | 20 | `useAddToPlanStepButtons.ts.useAddToPlanStepButtons(AddToPlanStepButtonsProps)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/useAddToPlanStepButtons.ts#L13:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-324 | 20 | `buildStep2WizardButtons.ts.buildStep2WizardButtons(Model)` | `src/Components/Nabewerking/CreateReport/Steps/Step2/buildStep2WizardButtons.ts#L9:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-325 | 20 | `webMercatorToWgs84.ts.webMercatorToWgs84(number,number)` | `src/Components/Voorbereiding/DrawingTool/helpers/webMercatorToWgs84.ts#L4:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-326 | 20 | `generateReportZip.ts.generateReportZip(GenerateReportZipInput)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/generateReportZip.ts#L13:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-327 | 20 | `buildPointCoordinatePayload.ts.buildPointCoordinatePayload(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/buildPointCoordinatePayload.ts#L4:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-328 | 20 | `submitAddToPlanSelection.ts.submitAddToPlanSelection(SubmitAddToPlanSelectionInput)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/submitAddToPlanSelection.ts#L16:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-329 | 20 | `createAttachment.ts.createAttachment(Request,Response)` | `backend/src/routes/finished_plans/createAttachment.ts#L8:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-330 | 20 | `useDrawingToolLifecycle.ts.useDrawingToolStep2Lifecycle(any)` | `src/Components/Voorbereiding/DrawingTool/helpers/useDrawingToolLifecycle.ts#L97:123` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-331 | 20 | `updateGeometryHelpers.ts.commitGeometryUpdate(any)` | `backend/src/routes/geometries/updateGeometryHelpers.ts#L5:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-332 | 20 | `nnederlandLayerSpecsPart3c.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart3c.ts#L1:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-333 | 20 | `deletePointHelpers.ts.deletePointInTransaction(PoolClient,number)` | `backend/src/routes/points/deletePointHelpers.ts#L7:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-334 | 20 | `pointHitSelection.ts.applyPointHitSelection(any)` | `src/Components/HomePage/hooks/popUpModal/pointHitSelection.ts#L10:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-335 | 20 | `loginDirectHelpers.ts.performDirectLogin(Request,any)` | `backend/src/routes/auth/authKeycloak/loginDirectHelpers.ts#L21:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-336 | 20 | `geometriesRepo.ts` | `backend/src/helpers/repositories/geometriesRepo.ts#L1:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-337 | 20 | `sessionStoreSetup.ts.attachRedisSessionStore(session.SessionOptions,number)` | `backend/src/helpers/session/sessionStoreSetup.ts#L27:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-338 | 20 | `useDeletePointMapSelection.ts.useDeletePointMapSelection()` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/useDeletePointMapSelection.ts#L7:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-339 | 20 | `db.ts.queueDeviceCommand(string,DeviceCommand)` | `backend/src/routes/devices-updates/db.ts#L105:129` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-340 | 20 | `useGeometriesListBase.ts.useGeometriesListBase(any)` | `src/Components/Voorbereiding/FlightPlan/Common/useGeometriesListBase.ts#L7:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-341 | 20 | `loadRoles()` | `src/Components/DashboardPage/shared/useKeycloakRoles.ts#L17:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-342 | 20 | `resolveRegioFilter.ts` | `backend/src/helpers/queries/shared/resolveRegioFilter.ts#L1:3` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-343 | 20 | `loginHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth2/loginHandler.ts#L6:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-344 | 20 | `attachmentFetch.ts.fetchAttachmentsForPoint(string,number)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/attachmentFetch.ts#L47:70` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-345 | 20 | `reportUpload.ts` | `backend/src/routes/reportUpload.ts#L1:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-346 | 20 | `createFinishedPlanHelpers.ts.saveFinishedPlanWithClient(any)` | `backend/src/routes/finished_plans/createFinishedPlanHelpers.ts#L41:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-347 | 20 | `serverListen.ts.attachListenErrorHandler(Server,number)` | `backend/src/serverListen.ts#L3:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-348 | 20 | `NewGeometriesList.tsx.NewGeometriesList()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/NewGeometriesList.tsx#L10:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-349 | 20 | `buildReusePlanPointIds.ts.buildReuseFlightPlanPointIds(BuildReuseFlightPlanPointIdsInput)` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/helpers/buildReusePlanPointIds.ts#L13:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-350 | 20 | `index.tsx.Step3()` | `src/Components/Nabewerking/CreateReport/Steps/Step3/index.tsx#L10:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-351 | 20 | `useTableLayout.ts.useTableLayout(UseTableLayoutInput)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useTableLayout.ts#L35:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-352 | 20 | `SubmitPointCoordinatesInput.submitPointCoordinateUpdate(SubmitPointCoordinatesInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/submitPointCoordinates.ts#L31:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-353 | 20 | `createKeycloakUser.ts.createKeycloakUserRecord(Request,CreateKeycloakUserInput)` | `backend/src/routes/keycloak/management/users/createKeycloakUser.ts#L35:59` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-354 | 20 | `filterState.ts` | `src/hooks/zustand/ui/filterState.ts#L1:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-355 | 20 | `createAttachmentHelpers.ts.insertAttachmentRow(InsertAttachmentInput)` | `backend/src/routes/finished_plans/createAttachmentHelpers.ts#L36:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-356 | 20 | `getacDevicesSchemaSql.ts` | `backend/src/routes/devices-updates/getacDevicesSchemaSql.ts#L1:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-357 | 20 | `useTableScrollWidth.ts.useTableScrollWidth(UseTableScrollWidthParams)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useTableScrollWidth.ts#L27:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-358 | 20 | `useResizableSidebarCore.ts.useResizableSidebar(number,ResizeHandleSide)` | `src/Components/HomePage/hooks/layout/useResizableSidebarCore.ts#L14:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-359 | 20 | `useBottomCompactListStores.ts.useBottomCompactListStores()` | `src/Components/HomePage/hooks/bottom/useBottomCompactListStores.ts#L10:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-360 | 20 | `pointCoreColumns.ts` | `backend/src/helpers/queries/points/pointCoreColumns.ts#L3:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-361 | 20 | `persistLoginSession.ts.persistLoginSession(any)` | `backend/src/routes/auth2/persistLoginSession.ts#L9:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-362 | 20 | `ResultTab.tsx.ResultTab()` | `src/Components/HomePage/Body/Left/Common/BottomTabs/ResultTab.tsx#L6:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-363 | 20 | `pointJson.ts` | `backend/src/helpers/queries/points/pointJson.ts#L1:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-364 | 20 | `pdfReportTables.ts.addWrappedTable(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportTables.ts#L6:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-365 | 20 | `index.tsx.Step2(any)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/index.tsx#L9:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-366 | 20 | `featureLayerPopupClick.ts.attachFeatureLayerPopupClick(any)` | `src/Components/HomePage/hooks/hover-click-handlers/featureLayerPopupClick.ts#L7:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-367 | 20 | `resetAddPointStepState.ts.removeAddPointMapGraphics(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/resetAddPointStepState.ts#L4:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-368 | 20 | `useEnrichedAddPointMapWiring.ts.useEnrichedAddPointMapWiring()` | `src/Components/Voorbereiding/EnrichedAddPoint/useEnrichedAddPointMapWiring.ts#L6:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-369 | 20 | `mapViewBaseLayersSlice.ts.createMapViewBaseLayersSlice(Partial<MapViewState>,any)` | `src/hooks/zustand/ui/mapViewBaseLayersSlice.ts#L3:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-370 | 20 | `useRenderGeometries.ts.useRenderGeometries(FinishedFlightPlanType\|null,number[])` | `src/Components/Nabewerking/CreateReport/Steps/Step2/hooks/useRenderGeometries.ts#L9:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-371 | 20 | `fetchTimeRange()` | `src/hooks/time/useTimeRangeCore.ts#L25:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-372 | 20 | `buildTimesliderImageViewerProps.ts.buildTimesliderImageViewerProps(BuildTimesliderPageShellInput,ImageViewerExtras)` | `src/Components/TimesliderItemDetailPage/builders/buildTimesliderImageViewerProps.ts#L18:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-373 | 20 | `ParentItemCheckbox.tsx.ParentItemCheckbox(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/ParentItemCheckbox.tsx#L3:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-374 | 20 | `mergeSelectedPointsIntoPlan.ts.mergeSelectedPointsIntoPlan(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/helpers/mergeSelectedPointsIntoPlan.ts#L6:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-375 | 20 | `updateFinishedPointAttachmentsTx.ts` | `backend/src/helpers/queries/finished-plans/updateFinishedPointAttachmentsTx.ts#L1:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-376 | 20 | `flightPlanColumnHelpers.ts` | `src/Components/HomePage/Body/Bottom/PointsView/FlightPlansTable/flightPlanColumnHelpers.ts#L1:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-377 | 20 | `toTimesliderPageViewInput.ts.toTimesliderPageViewInput(Core)` | `src/Components/TimesliderItemDetailPage/builders/toTimesliderPageViewInput.ts#L5:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-378 | 20 | `startDrawingSession(string)` | `src/Components/Voorbereiding/DrawingTool/Step1/Options.tsx#L64:88` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-379 | 20 | `bboxPolygon.ts.getBboxPolygon(any,any)` | `src/helpers/geo/bboxPolygon.ts#L3:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-380 | 20 | `useMapViewCompModel.ts.useMapViewCompModel(MapViewCompProps)` | `src/Components/HomePage/Body/MapViewComp/useMapViewCompModel.ts#L15:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-381 | 19 | `index.tsx.ChangePoint(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/ChangePoint/index.tsx#L15:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-382 | 19 | `timesliderPlanImages.ts.fetchTimesliderPlanImages(FetchTimesliderPlanImagesInput)` | `backend/src/helpers/queries/timeslider/timesliderPlanImages.ts#L27:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-383 | 19 | `spoedReportMail.ts.sendSpoedReportMail(SpoedMailPayload)` | `backend/src/routes/emails/spoedReportMail.ts#L29:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-384 | 19 | `getSearchedPoints.ts.getSearchedPoints(Request,Response)` | `backend/src/routes/points/getSearchedPoints.ts#L5:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-385 | 19 | `exportExcel(FlightPlanType)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx#L31:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-386 | 19 | `arcgisAdminTokenParse.ts.parseAdminTokenJson(AdminTokenJson,number)` | `backend/src/services/arcgisAdminTokenParse.ts#L4:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-387 | 19 | `createPointFromImportHelpers.ts.runImportPointsTransaction(any)` | `backend/src/routes/points/createPointFromImportHelpers.ts#L23:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-388 | 19 | `viewPlanSession.ts.useViewPlanCancel(void)` | `src/Components/Voorbereiding/ViewPlan/viewPlanSession.ts#L43:62` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-389 | 19 | `useWaarnemingenFilteredCollections.ts.useWaarnemingenFilteredCollections(FinishedFlightPlanType\|null\|undefined,string)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/useWaarnemingenFilteredCollections.ts#L8:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-390 | 19 | `NextBtn.tsx.NextBtn()` | `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/NextBtn.tsx#L9:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-391 | 19 | `deleteFlightPlanHelpers.ts.deleteFinishedFlightPlan(string,Response)` | `backend/src/routes/flightPlans/deleteFlightPlanHelpers.ts#L24:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-392 | 19 | `useRenderPoints.ts.useRenderPoints()` | `src/Components/HomePage/hooks/features/useRenderPoints.ts#L11:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-393 | 19 | `reportZipHelpers.ts.preloadReportAttachments(any)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/reportZipHelpers.ts#L11:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-394 | 19 | `handlePointClick(EnrichedPointType)` | `src/Components/HomePage/Body/Left/Common/WizardPointsList.tsx#L52:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-395 | 19 | `resolveSelectedTabItem.ts.resolveSelectedTabItem(string,Content)` | `src/Components/HomePage/Body/Left/Common/BottomTabs/resolveSelectedTabItem.ts#L10:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-396 | 19 | `buildEditPointDetailsPayload.ts.buildEditPointDetailsPayload(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/Form/buildEditPointDetailsPayload.ts#L4:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-397 | 19 | `handleUpload(React.FormEvent<HTMLFormElement>)` | `src/Components/InstallationsPage/index.tsx#L48:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-398 | 19 | `computeRealmRoleDiff.ts.computeRealmRoleDiff(any)` | `backend/src/routes/keycloak/management/users/computeRealmRoleDiff.ts#L24:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-399 | 19 | `syncAttachmentsInPlan.ts.buildUpdatedGeometryPoint(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/syncAttachmentsInPlan.ts#L31:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-400 | 19 | `buildFinishedPlanRegioWhereClause.ts.buildFinishedPlanRegioWhereClause(FinishedPlanRegioWhereInput)` | `backend/src/helpers/queries/finished-plans/buildFinishedPlanRegioWhereClause.ts#L13:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-401 | 19 | `syncLocalGeometryGraphics.ts.syncLocalGeometryGraphics(any)` | `src/Components/HomePage/hooks/features/syncLocalGeometryGraphics.ts#L7:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-402 | 19 | `addPointBufferGraphic.ts.addPointBufferGraphic(any)` | `src/Components/HomePage/Body/Left/Common/ResultTab/addPointBufferGraphic.ts#L12:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-403 | 19 | `createKeycloakUser.ts.setKeycloakUserPassword(any)` | `backend/src/routes/keycloak/management/users/createKeycloakUser.ts#L61:87` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-404 | 19 | `sortPointsWithSelectionOrderCore.ts.comparePointsWithSelectionOrder(CompareSelectionOrderInput)` | `src/Components/HomePage/hooks/points/sortPointsWithSelectionOrderCore.ts#L37:59` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-405 | 19 | `flightPlanSelectSql.ts.buildFlightPlanSelectBody(any)` | `backend/src/helpers/repositories/flightPlanSelectSql.ts#L13:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-406 | 19 | `resolveFlightPlanColumnPreset.ts` | `backend/src/helpers/queries/flight-plans/resolveFlightPlanColumnPreset.ts#L1:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-407 | 19 | `handleDeletePointEmptyMapClick.ts.handleDeletePointEmptyMapClick(any)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/handleDeletePointEmptyMapClick.ts#L47:77` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-408 | 19 | `buildFinishedPlansWithPointsHelpers.ts.appendFinishedRegioAndOrder(any)` | `backend/src/helpers/queries/finished-plans/buildFinishedPlansWithPointsHelpers.ts#L43:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-409 | 19 | `pathFeatureLayerConfig.ts` | `src/Components/HomePage/hooks/hover-click-handlers/pathFeatureLayerConfig.ts#L1:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-410 | 19 | `handleUpdate()` | `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/UpdateBtn.tsx#L17:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-411 | 19 | `getTimeRange.ts.getTimeRange(Request,Response)` | `backend/src/routes/timeslider/getTimeRange.ts#L6:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-412 | 19 | `Points.tsx.Points(PointsProps)` | `src/Components/Nabewerking/CreateReport/Steps/Step2/Points.tsx#L14:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-413 | 19 | `assembleReportZipContents.ts.assembleReportZipContents(AssembleReportZipInput)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/assembleReportZipContents.ts#L25:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-414 | 19 | `selectedPlansPointsList.ts.buildListItems(PointWithPlan[],GeometryWithPlan[])` | `src/helpers/timeslider/selectedPlansPointsList.ts#L96:117` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-415 | 19 | `useEditGeometryUiState.ts.useEditGeometryUiState()` | `src/Components/HomePageTools/EditGeometry/useEditGeometryUiState.ts#L4:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-416 | 19 | `useCreateImageBtnModel.ts.useCreateImageBtnModel(Props)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useCreateImageBtnModel.ts#L20:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-417 | 19 | `reportPdfCommon.ts.buildPdfPointData(ReportPdfPointContext)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/reportPdfCommon.ts#L15:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-418 | 19 | `polygonDrawer.ts.selectPointsInPolygonRing(EnrichedPointType[],number[])` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/polygonDrawer.ts#L12:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-419 | 19 | `PlansList.tsx.PlansList(any)` | `src/Components/Voorbereiding/SelectedPoint/ViewPlans/PlansList.tsx#L7:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-420 | 19 | `centerAndZoomMathCore.ts.goToLonLatZoom(any)` | `src/helpers/ArcGISHelpers/centerAndZoomMathCore.ts#L108:130` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-421 | 19 | `LegendSectionCore.ts.useLegendSectionLayers(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/LegendSectionCore.ts#L126:150` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-422 | 19 | `postProxyHelpers.ts.forwardArcgisPostRequest(Request)` | `backend/src/routes/arcgis/postProxyHelpers.ts#L85:104` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-423 | 19 | `buildTemplateFlightSubmitIds.ts.collectTemplateFlightPointIds(any)` | `src/Components/Voorbereiding/TemplateFlight/Steps/Step3/buildTemplateFlightSubmitIds.ts#L7:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-424 | 19 | `applyGraphicPositionNext.ts.commitGraphicPosition(ApplyGraphicPositionInput)` | `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/applyGraphicPositionNext.ts#L25:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-425 | 19 | `useAddPointStepMapClick.ts.useAddPointStepMapClick(AddPointStepMapClickState)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/useAddPointStepMapClick.ts#L7:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-426 | 19 | `resetAddPointStepState.ts.resetAddPointFormState(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/resetAddPointStepState.ts#L31:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-427 | 19 | `buildStep2LoginFailureBody.ts.buildStep2LoginFailureBody(Step2FailureKind)` | `backend/src/routes/auth2/buildStep2LoginFailureBody.ts#L12:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-428 | 19 | `verify-regio-apis.ts.main()` | `backend/scripts/verify-regio-apis.ts#L78:100` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-429 | 19 | `startPolling(string,any)` | `src/Components/DevicesUpdatesPage/useDeviceActionPolling.ts#L23:45` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-430 | 19 | `index.tsx` | `src/Components/HomePage/Body/Bottom/PointsView/FlightPlansTable/index.tsx#L1:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-431 | 19 | `createPointMapGraphics.ts` | `src/helpers/ArcGISHelpers/createPointMapGraphics.ts#L1:19` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-432 | 19 | `applyPointCoordinateUpdateSuccess.ts.applyPointCoordinateUpdateSuccess(PointCoordinateUpdateContext,any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/applyPointCoordinateUpdateSuccess.ts#L11:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-433 | 19 | `removeFlightPlanFilterEffects.ts.useRemoveFlightPlanFilterEffects(any)` | `src/Components/Voorbereiding/RemoveFlightPlan/removeFlightPlanFilterEffects.ts#L5:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-434 | 19 | `index.tsx.StepMultiplePoints(any)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/StepMultiplePoints/index.tsx#L7:69` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-435 | 19 | `deleteAttachmentsRequest.ts.postDeleteAttachmentsRequest(any)` | `src/helpers/arcgis/deleteAttachmentsRequest.ts#L17:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-436 | 19 | `drawingToolSketch.ts.symbolForTool(string)` | `src/Components/Voorbereiding/DrawingTool/helpers/drawingToolSketch.ts#L7:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-437 | 19 | `fileDownloadHelpers.ts.sendPasswordGateFailure(any)` | `backend/src/routes/fileDownloadHelpers.ts#L31:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-438 | 19 | `SelectButtons.tsx.SelectButtons(any)` | `src/Components/Voorbereiding/FlightPlan/Common/SelectButtons.tsx#L5:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-439 | 19 | `index.ts.createAuth2Router()` | `backend/src/routes/auth2/index.ts#L9:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-440 | 19 | `loginErrorDecision.ts.resolveLoginErrorDecision(any)` | `backend/src/routes/auth2/loginErrorDecision.ts#L17:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-441 | 19 | `db.ts.claimPendingCommand(string)` | `backend/src/routes/devices-updates/db.ts#L131:151` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-442 | 19 | `readOnlyVanTotParts.tsx.ReadOnlyRangeTrack()` | `src/Components/TimesliderItemDetailPage/sections/readOnlyVanTotParts.tsx#L13:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-443 | 19 | `applyEditPointDetailsSuccess.ts.applyEditPointDetailsSuccess(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/Form/applyEditPointDetailsSuccess.ts#L7:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-444 | 19 | `index.tsx.Step1()` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Step1/index.tsx#L10:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-445 | 19 | `useGeometryListGraphics.ts.useGeometryListGraphics(any)` | `src/Components/Voorbereiding/FlightPlan/Common/useGeometryListGraphics.ts#L8:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-446 | 19 | `Buttons.tsx.Buttons()` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Step3/Buttons.tsx#L10:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-447 | 19 | `updateFinishedPointAttachmentsHelpers.ts` | `backend/src/routes/finished_plans/updateFinishedPointAttachmentsHelpers.ts#L1:12` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-448 | 19 | `nnederlandLayerIconMap.tsx` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerIconMap.tsx#L1:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-449 | 19 | `useFotoPanelModel.ts.useFotoPanelModel(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useFotoPanelModel.ts#L15:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-450 | 19 | `attachSelectedPlanPathLayer.ts` | `src/Components/HomePage/hooks/hover-click-handlers/attachSelectedPlanPathLayer.ts#L1:7` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-451 | 19 | `meHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth2/meHandler.ts#L13:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-452 | 19 | `middleware.ts.attachDeviceFromToken(Request,Response,string,NextFunction)` | `backend/src/routes/devices-updates/middleware.ts#L12:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-453 | 19 | `useSelectFromSourceGraphicsEffects.ts.useBluePointRendering(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceGraphicsEffects.ts#L50:74` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-454 | 19 | `shapefileExportCore.ts.exportPointsShapefile(EnrichedPointType[])` | `src/Components/HomePage/helpers/tableExports/shapefileExportCore.ts#L46:65` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-455 | 18 | `Buttons.tsx.Step1Buttons()` | `src/Components/Nabewerking/CreateReport/Steps/Step1/Buttons.tsx#L9:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-456 | 18 | `useSelectFromSourceGraphicsEffects.ts.useSourcePointHover(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceGraphicsEffects.ts#L109:131` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-457 | 18 | `arcgisTokenStringFieldSpecs.ts.buildAdminUserAndPassSpecs(ArcgisTokenConfig\|undefined,NodeJS.ProcessEnv)` | `backend/src/services/arcgisTokenStringFieldSpecs.ts#L38:58` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-458 | 18 | `openBottomCompactListView.ts.openBottomCompactListView(BottomCompactListSetters)` | `src/Components/HomePage/hooks/bottom/openBottomCompactListView.ts#L14:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-459 | 18 | `useEditPointStep2Sub1.ts.useEditPointStep2Sub1(EditPointMapStepProps)` | `src/Components/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/useEditPointStep2Sub1.ts#L10:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-460 | 18 | `createReportSetters.ts.createReportSetters(Partial<CreateReportState>,any)` | `src/Components/HomePage/hooks/zustand/nabewerking/createReportSetters.ts#L7:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-461 | 18 | `deleteFinishedFlightPlan.ts.deleteFinishedFlightPlanCascade(PoolClient,string)` | `backend/src/helpers/queries/flight-plans/deleteFinishedFlightPlan.ts#L31:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-462 | 18 | `geometryMapGraphics.ts.buildGeometryMapGraphics(Geometry[])` | `src/Components/HomePage/hooks/features/geometryMapGraphics.ts#L4:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-463 | 18 | `db.ts.resetDeviceCommand(string)` | `backend/src/routes/devices-updates/db.ts#L84:103` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-464 | 18 | `PeriodFilterPanel.tsx.PeriodFilterPanel(any)` | `src/Components/HomePage/Body/Left/Common/PeriodFilterPanel.tsx#L16:115` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-465 | 18 | `index.tsx.Step1()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step1/index.tsx#L14:60` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-466 | 18 | `useAddPointStates.ts` | `src/hooks/zustand/useAddPointStates.ts#L1:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-467 | 18 | `Auth2RateLimiters.createRateLimitHandler(any)` | `backend/src/routes/auth2/authRateLimitHelpers.ts#L39:58` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-468 | 18 | `Profile.configureOidcHttpOptions()` | `backend/src/routes/auth/oidcClientCache.ts#L12:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-469 | 18 | `db.ts` | `backend/src/db.ts#L1:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-470 | 18 | `buildPlanBoundingBoxGraphicCore.ts.buildBoundingBoxFillSymbol(NonNullable<CreatePlanBoundingBoxGraphicOptions["symbolOptions"]>)` | `src/helpers/ArcGISHelpers/buildPlanBoundingBoxGraphicCore.ts#L14:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-471 | 18 | `getAvailableRoles.ts.getAvailableRoles(Request)` | `backend/src/routes/keycloak/management/users/getAvailableRoles.ts#L9:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-472 | 18 | `useRenderPlanPoints.ts.useRenderPlanPoints()` | `src/Components/Nabewerking/VluchtenZoeken/hooks/useRenderPlanPoints.ts#L13:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-473 | 18 | `useSelectFromSourceGraphicsEffects.ts.useSelectionPins(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceGraphicsEffects.ts#L76:99` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-474 | 18 | `handleSubmit()` | `src/Components/Voorbereiding/TemplateFlight/Steps/Step3/Buttons.tsx#L54:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-475 | 18 | `useEditPointCleanup.ts.runEditPointCleanup(EditPointCleanupInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCleanup.ts#L19:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-476 | 18 | `grantError.ts.extractGrantError(unknown)` | `backend/src/routes/auth2/grantError.ts#L82:100` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-477 | 18 | `authRateLimit.ts.createAuth2RateLimiters()` | `backend/src/routes/auth2/authRateLimit.ts#L51:69` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-478 | 18 | `drawGeometryHoverSkyBlue.ts.createSkyBluePolygonGraphic(number[],number)` | `src/helpers/timeslider/drawGeometryHoverSkyBlue.ts#L12:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-479 | 18 | `Geometries.tsx.Geometries(GeometriesProps)` | `src/Components/Nabewerking/CreateReport/Steps/Step2/Geometries.tsx#L12:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-480 | 18 | `keycloakUserResolve.ts.fetchExactUsernameUsers(Request,string)` | `backend/src/routes/auth2/keycloakUserResolve.ts#L39:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-481 | 18 | `index.tsx.Main()` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/index.tsx#L11:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-482 | 18 | `selectFromSourceGraphics.ts.addPinForSelectedPoint(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/helpers/selectFromSourceGraphics.ts#L47:73` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-483 | 18 | `PointJsonFieldKey.buildAttachmentsAggregationExpr(string)` | `backend/src/helpers/queries/points/pointJson.ts#L140:159` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-484 | 18 | `computeFlightPlanCentroid.ts.computeFlightPlanCentroid(any)` | `src/helpers/ArcGISHelpers/computeFlightPlanCentroid.ts#L21:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-485 | 18 | `installers.ts` | `backend/src/routes/installers.ts#L1:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-486 | 18 | `pdfReportAttachments.ts.addImageAttachmentPage(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportAttachments.ts#L12:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-487 | 18 | `bufferFlightPlansOnLayerCore.ts.bufferSingleFlightPlan(any)` | `src/helpers/ArcGISHelpers/bufferFlightPlansOnLayerCore.ts#L32:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-488 | 18 | `handleDelete()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/DeletePoint/index.tsx#L22:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-489 | 18 | `parseCsvImportRows.ts` | `src/Components/Voorbereiding/FlightPlan/helpers/parseCsvImportRows.ts#L1:2` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-490 | 18 | `deleteGeometryCascade.ts.deleteGeometryCascade(any)` | `backend/src/routes/geometries/deleteGeometryCascade.ts#L27:53` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-491 | 18 | `CurrentPointsList.tsx.CurrentPointsList()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/CurrentPointsList.tsx#L6:15` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-492 | 18 | `uploadZip()` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/useUploadZip.ts#L32:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-493 | 18 | `viewPlanStepMapActions.ts` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/viewPlanStepMapActions.ts#L1:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-494 | 18 | `index.tsx.TemplateFlight()` | `src/Components/Voorbereiding/TemplateFlight/index.tsx#L11:63` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-495 | 18 | `flightPlanKeys.ts` | `src/lib/queryKeys/flightPlanKeys.ts#L1:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-496 | 18 | `usePointGraphicsEffects.ts.usePointGraphicsClick(any)` | `src/Components/HomePage/hooks/features/usePointGraphicsEffects.ts#L119:140` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-497 | 18 | `index.tsx.SelectedPointDetails()` | `src/Components/Voorbereiding/SelectedPoint/SelectedPointDetails/index.tsx#L12:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-498 | 18 | `runMultiPointDelete.ts.runMultiPointDelete(MultiPointDeleteInput)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/runMultiPointDelete.ts#L23:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-499 | 18 | `editPointCoordSyncTransforms.ts` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/editPointCoordSyncTransforms.ts#L1:4` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-500 | 18 | `pointsPlansTableExport.ts` | `src/Components/HomePage/helpers/tableExports/pointsPlansTableExport.ts#L1:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-501 | 18 | `copyLinkActions.ts.setDownloadPassword(any)` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/copyLinkActions.ts#L10:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-502 | 18 | `updateUser.ts.updateUser(Request,Response)` | `backend/src/routes/users/updateUser.ts#L10:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-503 | 18 | `applyImportSuccess(BulkImportResponse)` | `src/Components/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx#L53:73` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-504 | 18 | `useEditPointCoordinateInputs.ts.useInitialEditPointMarker(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinateInputs.ts#L28:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-505 | 18 | `useGeometryListMapClick.ts.useGeometryListInteractions(any)` | `src/Components/Voorbereiding/FlightPlan/Common/useGeometryListMapClick.ts#L37:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-506 | 18 | `createLogs.ts.createLogs(Request,Response)` | `backend/src/routes/logs/createLogs.ts#L9:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-507 | 18 | `useWizardPointsFilterHeaderCore.tsx.useWizardPointsFilterHeader(any)` | `src/Components/HomePage/hooks/points/useWizardPointsFilterHeaderCore.tsx#L35:62` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-508 | 18 | `drawGeometryHoverSkyBlue.ts.createSkyBluePolylineGraphic(number[],number)` | `src/helpers/timeslider/drawGeometryHoverSkyBlue.ts#L34:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-509 | 18 | `filterPlansByPeriod.ts.filterPlansByPeriod(FilterPlansByPeriodInput<T>)` | `src/Components/HomePage/hooks/filters/filterPlansByPeriod.ts#L68:89` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-510 | 18 | `verifyCredentialsResponses.ts.respondToVerifyLookup(any)` | `backend/src/routes/auth2/verifyCredentialsResponses.ts#L27:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-511 | 18 | `configureBodyParsersAndSwagger.ts.configureBodyParsersAndSwagger(Express)` | `backend/src/configure/configureBodyParsersAndSwagger.ts#L14:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-512 | 18 | `useMapGraphics.ts.useMapGraphics(UseMapGraphicsInput)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/useMapGraphics.ts#L8:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-513 | 18 | `handleLogout()` | `src/Components/DashboardPage/Navbar.tsx#L13:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-514 | 18 | `useMapPointSelectionClickCore.ts.useMapPointSelectionClick(any)` | `src/Components/HomePage/hooks/viewPlan/useMapPointSelectionClickCore.ts#L17:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-515 | 18 | `UserList.tsx.UserList(any)` | `src/Components/HomePage/Head/Users/UserList.tsx#L9:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-516 | 18 | `patchPlanWithUpdatedPoint.ts.maybeUpdateSavedGraphics(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/patchPlanWithUpdatedPoint.ts#L30:55` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-517 | 17 | `useDeletePointMapClick.ts.useDeletePointMapClick(any)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/useDeletePointMapClick.ts#L9:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-518 | 17 | `utils.ts.fetchWithRetry(any)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/utils.ts#L28:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-519 | 17 | `applyGeometryDeleteSuccess.ts.applyGeometryDeleteSuccess(any)` | `src/Components/HomePageTools/EditGeometry/applyGeometryDeleteSuccess.ts#L4:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-520 | 17 | `EditUserFormData.persistEditUser(KeycloakUser,EditUserFormData)` | `src/Components/DashboardPage/EditUser/submitEditUser.ts#L14:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-521 | 17 | `flightPlanFields.ts` | `backend/src/shared/flightPlanFields.ts#L2:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-522 | 17 | `pathPointGraphics.ts.addSelectedPathHighlight(__esri.GraphicsLayer,PathPoint)` | `src/Components/HomePage/hooks/hover-click-handlers/pathPointGraphics.ts#L14:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-523 | 17 | `useDeletePointStep1FormModel.ts.useDeletePointStep1FormModel()` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/useDeletePointStep1FormModel.ts#L7:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-524 | 17 | `importPointRowNormalization.ts.normalizeImportRows(unknown[])` | `backend/src/helpers/points/importPointRowNormalization.ts#L111:133` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-525 | 17 | `SinglePlan.tsx.SinglePlan(any)` | `src/Components/Nabewerking/CreateReport/Steps/Step1/SinglePlan.tsx#L7:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-526 | 17 | `ImportPointsDbResult.bulkInsertRowParams(NormalizedImportRow,Date)` | `backend/src/helpers/points/createPointFromImportDb.ts#L30:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-527 | 17 | `flightPlansRepo.ts.selectPreparedFlightPlans(Queryable,string\|undefined)` | `backend/src/helpers/repositories/flightPlansRepo.ts#L185:206` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-528 | 17 | `Form.tsx.Form(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/Step2/Form.tsx#L9:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-529 | 17 | `geometryGraphicBuilders.ts.buildPolygonGraphic(any)` | `src/helpers/ArcGISHelpers/geometryGraphicBuilders.ts#L41:62` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-530 | 17 | `handleSubmit()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/EditFlight/Buttons.tsx#L26:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-531 | 17 | `finishedPlanCentroidMarkersCore.ts.addFinishedPlanGeometryCentroidMarkers(any)` | `src/helpers/ArcGISHelpers/finishedPlanCentroidMarkersCore.ts#L20:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-532 | 17 | `SortedAttachment.buildImageMarkerGraphics(SortedAttachment[])` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/buildImageMarkerGraphics.ts#L28:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-533 | 17 | `handleSubmit()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinateSubmit.ts#L27:43` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-534 | 17 | `syncRealmRoleMappings.ts.syncRealmRoleMappings(any)` | `backend/src/routes/keycloak/management/users/syncRealmRoleMappings.ts#L31:54` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-535 | 17 | `useStepContentDisplayed.ts.useStepContentDisplayed(any)` | `src/Components/Voorbereiding/AddPointsVluchtPlan/Common/useStepContentDisplayed.ts#L8:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-536 | 17 | `createMapView.ts.createMapView(RefObject<HTMLDivElement>)` | `src/helpers/ArcGISHelpers/createMapView.ts#L10:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-537 | 17 | `flightPlanPointExcelCore.ts.mapPointToExportRow(EnrichedPointType,FlightPlanType)` | `src/Components/HomePage/helpers/points/flightPlanPointExcelCore.ts#L70:89` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-538 | 17 | `mapLoginError.ts.mapLoginError(unknown,MapLoginErrorContext)` | `backend/src/routes/auth2/mapLoginError.ts#L19:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-539 | 17 | `planBoundingBoxSymbolsCore.ts` | `src/helpers/ArcGISHelpers/planBoundingBoxSymbolsCore.ts#L1:17` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-540 | 17 | `ParentItemToggle.tsx.ParentItemToggle(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/ParentItemToggle.tsx#L4:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-541 | 17 | `fotoPanelModelHelpers.ts.createFotoDeleteHandler(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/fotoPanelModelHelpers.ts#L45:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-542 | 17 | `useFilterStepWizardSelection.ts.useFilterStepWizardSelection(any)` | `src/Components/Voorbereiding/common/useFilterStepWizardSelection.ts#L9:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-543 | 17 | `loginHandlerHelpers.ts.prepareLoginSession(Request,string)` | `backend/src/routes/auth/authKeycloak/loginHandlerHelpers.ts#L5:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-544 | 17 | `createGeometryGraphic.ts` | `src/helpers/ArcGISHelpers/createGeometryGraphic.ts#L1:19` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-545 | 17 | `LegendSectionCore.ts.buildUseLegendLayersOptions(any)` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/Common/LegendSectionCore.ts#L56:80` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-546 | 17 | `fetchTemplateFlightPlanListHelpers.ts.loadFormattedTemplatePlans(Request)` | `backend/src/helpers/queries/templates/fetchTemplateFlightPlanListHelpers.ts#L12:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-547 | 17 | `pdfReportAttachments.ts.addOtherAttachmentsTable(jsPDF,PdfAttachment[])` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportAttachments.ts#L35:51` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-548 | 17 | `useBottomCompactListCallback.ts.useBottomCompactListCallback(string)` | `src/Components/HomePage/hooks/bottom/useBottomCompactListCallback.ts#L5:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-549 | 17 | `syncYellowMarkerSelection.ts.syncYellowMarkerSelection(SyncYellowMarkerSelectionInput)` | `src/Components/HomePage/hooks/hover-click-handlers/syncYellowMarkerSelection.ts#L21:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-550 | 17 | `logFields.ts.buildLogInsertValues(number,LogInsertInput)` | `backend/src/helpers/queries/logs/logFields.ts#L49:68` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-551 | 17 | `keycloakUserApi.ts.assignKeycloakUserRoles(any)` | `src/Components/DashboardPage/shared/keycloakUserApi.ts#L47:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-552 | 17 | `editGeometryHandlerFactories.ts.makeDeleteHandler(Model)` | `src/Components/HomePageTools/EditGeometry/editGeometryHandlerFactories.ts#L56:72` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-553 | 17 | `geometryHoverGraphics.ts.buildGeometryHoverState(HoverableGeometry)` | `src/Components/HomePage/hooks/hover-click-handlers/geometryHoverGraphics.ts#L20:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-554 | 17 | `attachments.ts.safeFetchPointAttachments(string,FinishedPointType)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/attachments.ts#L9:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-555 | 17 | `getUserById.ts.getUserById(string,Request)` | `backend/src/routes/keycloak/management/users/getUserById.ts#L10:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-556 | 17 | `getUsers.ts.getUsers(Request,Response)` | `backend/src/routes/users/getUsers.ts#L5:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-557 | 17 | `getPrePreparedPlanPoints.ts.getPrepreparedFlightPlanPoints(Request,Response)` | `backend/src/routes/points/getPrePreparedPlanPoints.ts#L5:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-558 | 17 | `reportUpload.ts.uploadErrorHandler(UploadErrorHandlerInput)` | `backend/src/routes/reportUpload.ts#L92:108` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-559 | 17 | `ImportVluchtPlan.tsx.ImportVluchtPlan()` | `src/Components/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx#L29:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-560 | 17 | `keycloakUserLookup.ts.lookupKeycloakUser(Request,string)` | `backend/src/routes/auth2/keycloakUserLookup.ts#L76:96` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-561 | 17 | `sortPointsWithSelectionOrderCore.ts.sortPointsWithSelectionOrder(T[],number[])` | `src/Components/HomePage/hooks/points/sortPointsWithSelectionOrderCore.ts#L61:82` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-562 | 17 | `netherlandsMapBounds.ts.createNetherlandsMapBounds()` | `src/helpers/ArcGISHelpers/netherlandsMapBounds.ts#L13:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-563 | 17 | `buildReportPdfPayload.ts.buildReportPdfPayload(ReportGenerationPipelineInput)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/buildReportPdfPayload.ts#L10:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-564 | 17 | `create(CreateInput<T, R>)` | `src/api-hooks/mutations/useCreateDataCore.ts#L37:53` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-565 | 17 | `pointsRepo.ts.bulkInsertPointsByColumns(Queryable,any)` | `backend/src/helpers/repositories/pointsRepo.ts#L211:233` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-566 | 17 | `useAddToPlanStepSketch.ts.useAddToPlanStepSketch(any)` | `src/Components/Voorbereiding/SelectedPoint/AddToPlan/useAddToPlanStepSketch.ts#L6:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-567 | 17 | `buildSyncTableTabGraphicsArgs.ts.buildSyncTableTabGraphicsArgs(UseMapGraphicsInput)` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/buildSyncTableTabGraphicsArgs.ts#L3:19` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-568 | 17 | `handleDirectDownload()` | `src/Components/Nabewerking/CreateReport/Steps/Step3/hooks/useDirectDownload.ts#L41:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-569 | 17 | `handleSubmit()` | `src/Components/Voorbereiding/FlightPlan/Steps/Step3/Buttons.tsx#L60:70` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-570 | 17 | `getSearchedFlightPlans.ts.getSearchedFlightPlans(Request,Response)` | `backend/src/routes/flightPlans/getSearchedFlightPlans.ts#L4:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-571 | 17 | `finishedPlansQuerySql.ts.buildFinishedFlightPlansListSelect(string)` | `backend/src/helpers/repositories/finishedPlansQuerySql.ts#L45:61` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-572 | 17 | `handleSubmit()` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/SelectFromSourceButtons.tsx#L30:47` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-573 | 17 | `postProxyHelpers.ts.postUrlencodedToArcgis(any)` | `backend/src/routes/arcgis/postProxyHelpers.ts#L6:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-574 | 17 | `useAddPointStepBaseStores.ts.useAddPointStepBaseStores()` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointStep/useAddPointStepBaseStores.ts#L8:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-575 | 17 | `LoadingPhase.tsx.LoadingPhase(LoadingPhaseProps)` | `src/Components/Nabewerking/CreateReport/Steps/Step3/components/LoadingPhase.tsx#L10:65` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-576 | 17 | `index.tsx.TemplateFlight(any)` | `src/Components/Voorbereiding/FlightPlan/Steps/Step1/TemplateFlights/index.tsx#L17:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-577 | 17 | `createGeometryGraphicInternal.ts.buildGraphicForGeometryType(any)` | `src/helpers/ArcGISHelpers/createGeometryGraphicInternal.ts#L43:66` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-578 | 17 | `updateUser.ts.updateUser(UpdateUserInput)` | `backend/src/routes/keycloak/management/users/updateUser.ts#L15:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-579 | 17 | `planBoundingBoxGeometryCore.ts.createPlanBoundingBoxPolygon(any)` | `src/helpers/ArcGISHelpers/planBoundingBoxGeometryCore.ts#L47:67` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-580 | 17 | `useCreateImageUploadEffect.ts.useCreateImageUploadEffect(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useCreateImageUploadEffect.ts#L5:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-581 | 17 | `authRateLimit.ts.resolveAuth2RateLimitStore()` | `backend/src/routes/auth2/authRateLimit.ts#L12:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-582 | 17 | `usePointListBufferActions.ts.usePointListBufferActions(any)` | `src/Components/HomePage/Body/Left/Common/ResultTab/usePointListBufferActions.ts#L6:15` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-583 | 17 | `useResultTabStarredPointActionsCore.ts.useResultTabStarredPointActions()` | `src/Components/HomePage/hooks/resultTab/useResultTabStarredPointActionsCore.ts#L6:13` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-584 | 17 | `useAddPointToPlanMapEffects.ts.useAddPointToPlanPins(number[],EnrichedPointType[])` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointToPlan/useAddPointToPlanMapEffects.ts#L27:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-585 | 17 | `formatPlanGeometries.ts.formatPlansWithGeometries(Record<string, unknown>)` | `backend/src/helpers/queries/geometries/formatPlanGeometries.ts#L99:116` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-586 | 17 | `toEditPointCoordinatesView.ts.toEditPointCoordinatesView(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/toEditPointCoordinatesView.ts#L12:33` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-587 | 17 | `featureLayerPopupMarker.ts.createFeatureLayerMarker(any)` | `src/Components/HomePage/hooks/hover-click-handlers/featureLayerPopupMarker.ts#L4:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-588 | 17 | `index.tsx.ChangeFlightPlanStatus()` | `src/Components/Nabewerking/ChangeFlightPlanStatus/index.tsx#L12:38` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-589 | 17 | `geometriesRepo.ts.selectGeometriesWithPointRegio(Queryable,any)` | `backend/src/helpers/repositories/geometriesRepo.ts#L31:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-590 | 16 | `renderEditFormScreen.tsx.renderEditFormScreen(EditFormProps,any)` | `src/Components/HomePageTools/EditGeometry/EditForm/renderEditFormScreen.tsx#L6:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-591 | 16 | `geometryJson.ts` | `backend/src/helpers/queries/geometries/geometryJson.ts#L1:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-592 | 16 | `installersHandlers.ts.handleInstallerUploadComplete(Request,Response)` | `backend/src/routes/installersHandlers.ts#L29:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-593 | 16 | `registerMapHoverHandler.ts.registerMapHoverHandler(any)` | `src/Components/HomePage/hooks/features/registerMapHoverHandler.ts#L8:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-594 | 16 | `Fase3.tsx.useTemplateFase3MapPreview(any)` | `src/Components/Voorbereiding/FlightPlan/Steps/Step1/TemplateFlights/Fase3.tsx#L20:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-595 | 16 | `importPointRowNormalization.ts.buildNormalizedFields(any)` | `backend/src/helpers/points/importPointRowNormalization.ts#L74:93` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-596 | 16 | `handleEnrichedAddPointClick.ts.handleEnrichedAddPointClick(EnrichedAddPointClickInput)` | `src/Components/Voorbereiding/EnrichedAddPoint/handleEnrichedAddPointClick.ts#L18:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-597 | 16 | `parsePointImportFile.ts.mapImportRowsToPoints(any)` | `src/Components/Voorbereiding/FlightPlan/helpers/parsePointImportFile.ts#L55:78` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-598 | 16 | `loadImages()` | `src/api-hooks/planImages/useEntityPlanImages.ts#L55:71` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-599 | 16 | `pickViewPlanAddPointsState.ts.useViewPlanAddPointsState()` | `src/Components/Voorbereiding/ViewPlan/pickViewPlanAddPointsState.ts#L4:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-600 | 16 | `mapViewCoreSlice.ts.createMapViewCoreSlice(Partial<MapViewState>,any)` | `src/hooks/zustand/ui/mapViewCoreSlice.ts#L3:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-601 | 16 | `getFlighPlansNummer.ts.getFlighPlansNummer(Request,Response)` | `backend/src/routes/flightPlans/getFlighPlansNummer.ts#L5:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-602 | 16 | `useEditPointCoordinateEffectsFromStores.ts.useEditPointCoordinateEffectsFromStores(Stores)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinateEffectsFromStores.ts#L6:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-603 | 16 | `Buttons.tsx.Buttons(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Buttons.tsx#L11:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-604 | 16 | `PlansFilterSection.tsx.PlansFilterSection(PlansFilterSectionProps)` | `src/Components/TimesliderItemDetailPage/sections/PlansFilterSection.tsx#L8:87` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-605 | 16 | `goToPoint()` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/FlightPlans/FlightPlansList/ClickedPlan.tsx#L41:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-606 | 16 | `FormElements.tsx.FormElements()` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/EditFlight/FormElements.tsx#L12:72` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-607 | 16 | `toggleStarPlan(FlightPlanType)` | `src/Components/HomePage/Body/Bottom/PointsView/FlightPlansTable/index.tsx#L77:95` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-608 | 16 | `regioFilter.ts.buildRegioWhereClause(BuildRegioWhereClauseInput)` | `backend/src/helpers/queries/shared/regioFilter.ts#L106:125` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-609 | 16 | `getSingleFinishedFlightPlan.ts.getSingleFinishedFlightPlan(Request,Response)` | `backend/src/routes/finished_plans/getSingleFinishedFlightPlan.ts#L7:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-610 | 16 | `zoomToPoint()` | `src/Components/HomePage/Body/Left/Common/SearchedResultsTab/FlightPlans/FlightPlansList/ClickedPlan.tsx#L23:39` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-611 | 16 | `spoedReportSendHelpers.ts.buildAndMailSpoedArtifacts(ValidatedSpoed)` | `backend/src/routes/emails/spoedReportSendHelpers.ts#L49:66` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-612 | 16 | `basemapsListHelpers.ts.createBasemapsCatalog()` | `src/Components/HomePage/Body/Left/Common/KaartLegend/basemapsListHelpers.ts#L19:34` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-613 | 16 | `flightPlansRepo.ts.selectPreparedFlightPlanIdsWithRegio(Queryable,string\|undefined)` | `backend/src/helpers/repositories/flightPlansRepo.ts#L209:229` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-614 | 16 | `resolveFlightPlanQueryDefaults.ts.resolveFlightPlanQueryScalars(BuildFlightPlanQueryOptions,string)` | `backend/src/helpers/queries/flight-plans/resolveFlightPlanQueryDefaults.ts#L60:78` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-615 | 16 | `usePointsViewUiState.ts.usePointsViewUiState()` | `src/Components/HomePage/Body/Bottom/PointsView/common/hooks/usePointsViewUiState.ts#L4:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-616 | 16 | `useEditPointCoordSyncEffects.ts.useSyncEditPointCoordinateSystem(FinishedPointType\|null,CoordState)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordSyncEffects.ts#L41:60` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-617 | 16 | `index.tsx.PointsView(PointsViewProps)` | `src/Components/HomePage/Body/Bottom/PointsView/index.tsx#L12:84` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-618 | 16 | `buildCreatePointPayload.ts.buildCreatePointPayload(any)` | `src/Components/Voorbereiding/EnrichedAddPoint/helpers/buildCreatePointPayload.ts#L6:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-619 | 16 | `showPlanSearchListHoverBody.ts.showPlanSearchListHover(any)` | `src/Components/HomePage/hooks/hover-click-handlers/showPlanSearchListHoverBody.ts#L19:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-620 | 16 | `pdfReportAttachmentImage.ts.drawTakenAtCaption(any)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportAttachmentImage.ts#L21:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-621 | 16 | `timesliderPlanImagesFetch.ts.queryTimesliderPlanImages(any)` | `backend/src/helpers/queries/timeslider/timesliderPlanImagesFetch.ts#L10:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-622 | 16 | `Step2OtpFailureInput.respondToStep2OtpFailure(Step2OtpFailureInput)` | `backend/src/routes/auth2/loginFlowHelpers.ts#L46:64` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-623 | 16 | `verifyCredentialsHandler.ts.respondVerifyError(any)` | `backend/src/routes/auth2/verifyCredentialsHandler.ts#L21:40` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-624 | 16 | `usePointGraphicsEffects.ts.runPointGraphicClick(any)` | `src/Components/HomePage/hooks/features/usePointGraphicsEffects.ts#L96:117` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-625 | 16 | `swaggerInfo.ts.buildSwaggerInfo()` | `backend/src/routes/swaggerInfo.ts#L1:16` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-626 | 16 | `index.tsx.VliegrouteExporteren(any)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/VliegrouteExporteren/index.tsx#L25:48` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-627 | 16 | `regioPlanAssertions.ts.assertPlanRegiosWithDb(RegioTestReporter,any)` | `backend/scripts/regioPlanAssertions.ts#L29:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-628 | 16 | `finishedPlansQuerySql.ts.buildFinishedPlansSelectBody(string,string)` | `backend/src/helpers/repositories/finishedPlansQuerySql.ts#L71:89` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-629 | 16 | `verify-regio-apis.ts.testResolveRegioFilter()` | `backend/scripts/verify-regio-apis.ts#L30:46` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-630 | 16 | `timesliderPageViewScalars.ts.timesliderPageViewScalars(BuildTimesliderPageViewInput)` | `src/Components/TimesliderItemDetailPage/builders/timesliderPageViewScalars.ts#L3:20` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-631 | 16 | `index.tsx.Step2(any)` | `src/Components/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/index.tsx#L14:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-632 | 16 | `nearestPoint.ts.isCloserCandidate(any)` | `src/Components/HomePage/hooks/hover-click-handlers/nearestPoint.ts#L4:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-633 | 16 | `TimesliderRangeTrack.tsx.TimesliderRangeTrack(any)` | `src/Components/HomePage/Head/timeslider/TimesliderRangeTrack.tsx#L5:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-634 | 16 | `index.tsx.InstallationsPage()` | `src/Components/InstallationsPage/index.tsx#L19:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-635 | 16 | `geometryGraphicBuilders.ts` | `src/helpers/ArcGISHelpers/geometryGraphicBuilders.ts#L1:11` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-636 | 16 | `xlsxExportCore.ts.exportPointsPlansXlsx(any)` | `src/Components/HomePage/helpers/tableExports/xlsxExportCore.ts#L37:56` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-637 | 16 | `keycloakAdminClient.ts` | `backend/src/routes/keycloak/management/users/keycloakAdminClient.ts#L1:9` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-638 | 16 | `logoutHandler.ts.RequestHandler(any,any)` | `backend/src/routes/auth/authKeycloak/logoutHandler.ts#L27:44` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-639 | 16 | `buildFinishedFlightPlansListQuery.ts.buildFinishedFlightPlansListQuery(unknown)` | `backend/src/helpers/queries/finished-plans/buildFinishedFlightPlansListQuery.ts#L8:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-640 | 16 | `grantFailureSignals.ts.hasExplicitOtpRequiredSignal(string)` | `backend/src/routes/auth2/grantFailureSignals.ts#L9:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-641 | 16 | `regioFilter.ts.appendRegioFilter(AppendRegioFilterInput)` | `backend/src/helpers/queries/shared/regioFilter.ts#L85:104` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-642 | 16 | `useGeometriesStore.ts.loadGeometries(any)` | `src/hooks/features/useGeometriesStore.ts#L29:49` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-643 | 16 | `updateGeometryTransaction.ts.runGeometryUpdateTransaction(UpdateGeometryTransactionInput)` | `backend/src/helpers/queries/geometries/updateGeometryTransaction.ts#L10:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-644 | 16 | `ChevronButton.tsx.ChevronButton(any)` | `src/Components/HomePage/Body/Common/ChevronButton.tsx#L5:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-645 | 16 | `nnederlandLayerSpecsPart2d.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart2d.ts#L1:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-646 | 16 | `nearestPoint.ts.findNearestPoint(any)` | `src/Components/HomePage/hooks/hover-click-handlers/nearestPoint.ts#L30:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-647 | 16 | `configureCorsMiddleware.ts.configureCorsMiddleware(Express)` | `backend/src/configure/configureCorsMiddleware.ts#L6:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-648 | 16 | `submitEditPointDetails.ts.submitEditPointDetails(SubmitEditPointDetailsInput)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/Form/submitEditPointDetails.ts#L7:15` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-649 | 16 | `emptyPointCoreFields.ts` | `src/helpers/points/emptyPointCoreFields.ts#L1:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-650 | 16 | `PointsList.tsx.PointsList(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/PointsList.tsx#L10:52` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-651 | 16 | `Step1.tsx.Step1(any)` | `src/Components/Voorbereiding/PrepareFlightPlan/Steps/Step1.tsx#L8:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-652 | 16 | `showTable.ts` | `src/hooks/zustand/ui/showTable.ts#L1:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-653 | 16 | `createPoint.ts.createPoint(number,number)` | `src/helpers/ArcGISHelpers/createPoint.ts#L5:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-654 | 16 | `requireAuthClientHeader.ts.requireAuthClientHeader(any,any,any)` | `backend/src/routes/auth2/requireAuthClientHeader.ts#L9:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-655 | 16 | `getPointsDescription.ts.getPointsDescription(Request,Response)` | `backend/src/routes/points/getPointsDescription.ts#L5:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-656 | 16 | `pdfReportAttachmentImage.ts.paintScaledCanvas(HTMLImageElement)` | `src/Components/Nabewerking/CreateReport/helpers/pdfReportAttachmentImage.ts#L42:57` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-657 | 16 | `templatePlansRepo.ts.insertTemplatePlanReturning(Queryable,any)` | `backend/src/helpers/repositories/templatePlansRepo.ts#L40:58` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-658 | 16 | `getAllEmails.ts.getAllEmails(Request,Response)` | `backend/src/routes/emails/getAllEmails.ts#L4:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-659 | 16 | `App.tsx.App()` | `src/App.tsx#L17:50` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-660 | 16 | `featureLayerLabelGraphicsHelpers.ts.buildFeatureLabelGraphic(any)` | `src/Components/HomePage/hooks/hover-click-handlers/featureLayerLabelGraphicsHelpers.ts#L5:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-661 | 16 | `attachMapHoverLifecycle.ts.attachMapHoverLifecycle(AttachMapHoverLifecycleInput)` | `src/Components/HomePage/hooks/features/attachMapHoverLifecycle.ts#L19:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-662 | 16 | `enrichedPointStateDefaults.ts` | `src/hooks/zustand/enrichedPointStateDefaults.ts#L1:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-663 | 16 | `useLogAction.ts.useLogAction()` | `src/hooks/useLogAction.ts#L7:23` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-664 | 16 | `usePointsViewController.ts.usePointsViewController(number)` | `src/Components/HomePage/Body/Bottom/PointsView/usePointsViewController.ts#L6:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-665 | 16 | `useSelectFromSourceMapEffects.ts.useSelectFromSourceMapEffects(any)` | `src/Components/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/useSelectFromSourceMapEffects.ts#L11:31` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-666 | 16 | `GeometryItemCheckBox.tsx.GeometryItemCheckBox(any)` | `src/Components/Voorbereiding/FlightPlan/Common/GeometryItemCheckBox.tsx#L5:87` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-667 | 16 | `selectAll()` | `src/Components/HomePage/Body/Left/Common/ResultTab/ListPointsFunctions/index.tsx#L79:96` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-668 | 16 | `useWizardButtons.ts.useWizardButtons(string)` | `src/Components/HomePage/hooks/wizard/useWizardButtons.ts#L10:27` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-669 | 16 | `LoginRequiredModal.tsx.LoginRequiredModal(Props)` | `src/Components/TimesliderItemDetailPage/sections/LoginRequiredModal.tsx#L11:22` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-670 | 16 | `deletePointFormFields.ts.pickDeletePointFormFields(DeletePoint)` | `src/Components/HomePage/hooks/zustand/tools/deletePointFormFields.ts#L19:36` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-671 | 16 | `handleMapClick(__esri.ViewClickEvent)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useFotoMapClickHandler.ts#L27:42` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-672 | 16 | `index.ts.useHandleStep2(UseHandleStep2Input)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/index.ts#L23:37` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-673 | 16 | `CurrentGeometriesList.tsx.CurrentGeometriesList()` | `src/Components/Voorbereiding/ReuseFlightPlan/Steps/Step2/CurrentGeometriesList.tsx#L26:60` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-674 | 16 | `createTemplateFlightPlan.ts.createTemplateFlightPlan(Request,Response)` | `backend/src/routes/template_plans/createTemplateFlightPlan.ts#L10:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-675 | 16 | `launchPdfBrowser.ts.launchPdfBrowser()` | `backend/src/routes/emails/launchPdfBrowser.ts#L3:18` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-676 | 16 | `ImportPointsWriter.insertNewPoints()` | `backend/src/helpers/points/createPointFromImportDb.ts#L91:107` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-677 | 16 | `useRenderPlanGeometries.ts.useRenderPlanGeometries()` | `src/Components/Nabewerking/VluchtenZoeken/hooks/useRenderPlanGeometries.ts#L13:30` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-678 | 16 | `viewPlanSession.ts.resetViewPlanSession(any)` | `src/Components/Voorbereiding/ViewPlan/viewPlanSession.ts#L13:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-679 | 16 | `attachDeletePointMapClick.ts.selectPointFromHit(any)` | `src/Components/HomePageTools/AandachtspuntenVerwijderen/Actions/Main/attachDeletePointMapClick.ts#L4:28` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-680 | 16 | `useCreateDataCore.ts.useCreateData(string)` | `src/api-hooks/mutations/useCreateDataCore.ts#L24:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-681 | 16 | `postProxyHandler.ts.arcgisPostProxyHandler(Request,Response)` | `backend/src/routes/arcgis/postProxyHandler.ts#L4:24` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-682 | 16 | `useEnrichedAddPointMapClick.ts.useEnrichedAddPointMapClick(MapClickInput)` | `src/Components/Voorbereiding/EnrichedAddPoint/useEnrichedAddPointMapClick.ts#L10:26` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-683 | 16 | `useEditGeometryVerticesOnMap.ts.useEditGeometryVerticesOnMap(any)` | `src/Components/HomePage/hooks/hover-click-handlers/useEditGeometryVerticesOnMap.ts#L12:32` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-684 | 16 | `graphicPosition()` | `src/Components/Voorbereiding/EnrichedAddPoint/Steps/Step2/NextBtn.tsx#L26:41` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-685 | 16 | `nnederlandLayerSpecsPart1d.ts` | `src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerSpecsPart1d.ts#L1:21` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-686 | 16 | `GeometryPoint.patchGeometryPoint(GeometryPoint,string)` | `src/Components/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/updateGeometryPointsComment.ts#L19:35` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-687 | 16 | `finalizeReportPdfItem.ts.finalizeReportPdfItem(any)` | `src/Components/Nabewerking/CreateReport/helpers/useHandleStep2/finalizeReportPdfItem.ts#L5:29` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |
| US-L-688 | 16 | `useChangeFlightPlanStatusFilter.ts.useChangeFlightPlanStatusFilter(FlightPlanType[],any)` | `src/Components/Nabewerking/ChangeFlightPlanStatus/useChangeFlightPlanStatusFilter.ts#L7:25` | Extract helpers/subcomponents; shrink unit below threshold; retest; re-scan. |

---

## 10. AI Generated findings

No findings in this export.

---

## 11. Verification checklist (after changes)

1. Run frontend/backend tests and a manual smoke test of affected flows.
2. Rebuild Docker images and confirm non-root `USER` where changed.
3. Update vulnerable npm packages and commit `package-lock.json`.
4. Upload a new snapshot to Sigrid (or wait for CI integration).
5. Confirm Security, Duplication, Coupling, Independence, and Maintainability ratings move in the right direction.
6. For remaining LOW unit-size items, tackle in vertical slices (one feature folder at a time) rather than random files.

---

## Appendix — finding counts by file (export summary)

| CSV file | Rows | Notes |
|---|---|---|
| Security findings.csv | 13 | 5 open |
| Reliability findings.csv | 1 | all fixed |
| Unit complexity findings.csv | 0 | clean |
| Duplication findings.csv | 2 | 2 open HIGH |
| Duplicates.csv | 4 | location details |
| Module coupling findings.csv | 26 | 16 open |
| Component independence findings.csv | 131 | all open |
| Component entanglement findings.csv | 50 | 45 open |
| Unit interfacing findings.csv | 15 | all open LOW |
| Unit size findings.csv | 690 | all open |
| AI Generated findings.csv | 0 | clean |

