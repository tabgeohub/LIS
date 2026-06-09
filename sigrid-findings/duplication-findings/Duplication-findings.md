# Otg-lis Duplication Findings — Open Items

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Date:** 2026-06-05  

---

## Summary


| Metric                      | Value                            |
| --------------------------- | -------------------------------- |
| **Duplicate clusters**      | **~187** remaining (est.)        |
| **Severity**                | All **HIGH**                     |
| **Total redundant lines**   | **~2,440** remaining (est.)      |
| **File locations affected** | **~670** (est.; rescan to confirm) |


Duplication means the **same block of code appears in multiple places**. Sigrid counts how many lines are redundant and how often they repeat. Fixing duplication improves maintainability — one change updates one shared function instead of many copies.

**Regression tests for completed work:** `Duplication-test-checklist.md`

---

## By application area (remaining)


| Area                                 | Clusters (est.) | Redundant lines (est.) | Notes                            |
| ------------------------------------ | --------------- | ---------------------- | -------------------------------- |
| **Backend** (`backend/src/routes/…`) | ~70             | ~1,060                 | Validation, CRUD                 |
| **HomePage — Voorbereiding**         | ~38             | ~348                   | View plan add points             |
| **hooks**                            | ~10             | ~140                   | Residual hook patterns           |
| **HomePage — Search & tables**       | ~20             | ~200                   | Residual list/table patterns     |
| **HomePage — Nabewerking**           | ~15             | ~150                   | Residual nabewerking patterns    |
| **HomePage — Other**                 | ~18             | ~200                   | Layout, misc                     |
| **HomePage — Tools**                 | 5               | ~68                    | Edit point form steps            |
| **helpers**                          | ~10             | ~120                   | Shared utilities                 |
| **Other pages**                      | 10              | ~137                   | Dashboard, installations         |
| **Miscellaneous**                    | 122             | ~1,350                 | Small one-off duplicates         |


---

## Grouped by theme (recommended reading order)

Clusters are grouped by **what is duplicated**, not by Sigrid row order.  
**Redundant lines** = total copy-paste cost for that cluster.

---

### 1. Shared types — `finished_plans`

**3 clusters · ~101 redundant lines · Backend + frontend**


| Block size   | Occurrences | Key files                                                             |
| ------------ | ----------- | --------------------------------------------------------------------- |
| **43 lines** | 2×          | `backend/src/Types/finished_plans.ts` ↔ `src/Types/finished_plans.ts` |


**Suggested fix:** Single source of truth in `src/Types/`; backend imports from there (or shared package).

---

### 2. Backend — route validation & CRUD

**45 clusters · ~768 redundant lines**

Repeated request validation and create/update boilerplate.


| Block size   | Occurrences         | Key files                                                                                         |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------- |
| **12 lines** | **7×** in 5 files   | `createFinishedPlan`, `createGeometry`, `createPoint` (×3), `editPoint`, frontend edit step       |
| **6 lines**  | **10×** in 10 files | `createEmail`, `createFlightPlan`, `createPoint`, `editPoint`, `updateVluchtPlan`, status updates |
| **6 lines**  | **10×** in 6 files  | Missing-field checks across routes + frontend buttons                                             |
| 7 lines      | 7–8×                | `editPointStatus`, `updateFlightPlanStatus`, email delete/update                                  |


**Suggested fix:** `validateRequiredFields(req, fields)` middleware or shared validator; standard `handleCreate` pattern.

---

### 3. Edit point form steps

**~3 clusters · ~17 redundant lines · Tools vs Voorbereiding**

Duplicate Step2 sub-forms between “Aandachtspunten verwijderen” and “Selected point edit”.


| Block size | Key files                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| 17 lines   | `Step2Sub1.tsx` in Tools ↔ Voorbereiding                                     |
| 8 lines    | `AddToPlan/Step1`, `ViewPlans/PlansList`, etc. (Tools ↔ Voorbereiding pairs) |


**Suggested fix:** Shared form step components under `Components/Common/EditPoint/` (extend `AandachtspuntDetailsFields` where applicable).

---

### 4. View plan — add points

**14 clusters · ~194 redundant lines · Voorbereiding**


| Block size  | Occurrences | Key files                                                                     |
| ----------- | ----------- | ----------------------------------------------------------------------------- |
| 33 lines    | 2×          | `AddPointToPlan/PointsList` ↔ `AddPointsFromPlan/SelectFromSource/PointsList` |
| 16 lines    | 3×          | Coordinate watcher / update button (ViewPlan ↔ EnrichedAddPoint)              |
| 13–14 lines | 2–3×        | Add-point wizard buttons and layout                                           |


**Suggested fix:** Shared `PointsSelectionList` for view-plan flows.

---

### 5. Layout components

**3 clusters · ~38 redundant lines**


| Block size   | Key files                                                    |
| ------------ | ------------------------------------------------------------ |
| **17 lines** | `Body/Left/Common/Layout/index.tsx` ↔ `Body/Right/index.tsx` |


**Suggested fix:** Extract shared layout wrapper.

---

### 6. Miscellaneous

**122 clusters · ~1,350 redundant lines**

Smaller or one-off duplicates across Dashboard, emails, filters, import flows, etc. Address opportunistically when touching those files — not worth a dedicated sprint.

---

## Cross-stack duplication (backend ↔ frontend)

**21 clusters** span both backend and frontend (validation shapes, types, similar field checks). Highest priority:


| Item                    | Files                                             |
| ----------------------- | ------------------------------------------------- |
| `finished_plans` types  | `backend/src/Types/` ↔ `src/Types/`               |
| Point create validation | `createPoint.ts` ↔ `EditPointDetails/Steps/Step2` |
| Missing-field checks    | Multiple routes ↔ frontend form buttons           |


---

## Recommended fix priority


| Phase | Theme                            | Est. redundant lines removed | Effort |
| ----- | -------------------------------- | ---------------------------- | ------ |
| **A** | Shared `finished_plans` types (#1) | ~100                         | 1 h    |
| **B** | Backend validation (#2)          | ~400+                        | 2–3 h  |
| **C** | Edit point forms (#3)            | ~17                          | 1 h    |
| **D** | View plan add points (#4)        | ~194                         | 2–3 h  |
| **E** | Layout (#5)                      | ~38                          | 1 h    |


Phases **A + B** remove ~800+ redundant lines with the highest clarity gain.

---

## What not to chase

- **Miscellaneous** small blocks (6–8 lines) scattered across unrelated features  
- Duplication inside large one-off wizards unless already editing that area  
- Targeting **0 duplication** — unrealistic for an app this size; aim to clear HIGH clusters in tiers 1–2

---

## Quick reference — top open clusters by redundant lines


| Rank | Redundant lines | Description              | Main locations                |
| ---- | --------------- | ------------------------ | ----------------------------- |
| 1    | 72              | 12 lines × 7             | Backend + frontend validation |
| 2    | 54              | 6 lines × 10             | Backend CRUD validation       |
| 3    | 43              | 43 lines × 2             | `finished_plans` types mirror |


---

## Files in this folder


| File                            | Contents                                           |
| ------------------------------- | -------------------------------------------------- |
| `Duplication findings.csv`      | 398 duplicate clusters — one row per cluster       |
| `Duplicates.csv`                | 1,038 rows — one row per file location per cluster |
| `Duplication-findings.md`       | **Open** cluster status & fix priority             |
| `Duplication-test-checklist.md` | Regression tests after each duplication fix        |
