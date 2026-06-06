# Otg-lis Component Entanglement Findings — Status

**Source:** `component-entanglement-findings-rijkswaterstaat-otg-lis-20260605.csv`  
**Sigrid pillar:** Maintainability / Architecture (component entanglement)  
**Total findings:** 9  
**Fixed:** 0  
**Still open (RAW):** 9  
**Owner:** Developer team

---

## Summary

| Severity | Count | Type | Priority |
|----------|-------|------|----------|
| **HIGH** | **2** | Cyclic dependencies | Fix first — blocks clean layering |
| **MEDIUM** | **2** | High communication density | Address after cycles are broken |
| **LOW** | **5** | Moderate density + layer bypass | Incremental cleanup |

Unlike security/reliability, **all 9 items are application code** — nothing for DevOps. Fixing the two **HIGH** cycles should also reduce communication-density scores on `src/hooks` and `src/Components/HomePage`.

---

## Recommended layer model

Sigrid expects a one-way dependency flow:

```
Components  →  hooks / api-hooks  →  helpers / utils / Types
     ↑                ↑
     └── (never) ─────┘
```

**Rules:**

- `api-hooks` — React Query fetchers only; no UI imports
- `hooks` — shared React logic and Zustand stores; no imports from `Components/`
- `Components/` — UI; may import from `hooks`, `api-hooks`, `helpers`, `utils`
- Shared types live in `Types/` or `src/shared/types/`, not inside feature stores

---

## Still open — HIGH priority (2 findings)

### 1. Cyclic dependency: `src/api-hooks` ↔ `src/hooks`

| Field | Value |
|-------|-------|
| Severity | HIGH |
| Status | RAW |
| Source → Target | `src/api-hooks` → `src/hooks` (and reverse) |

**How the cycle forms today**

| Direction | Files | Import |
|-----------|-------|--------|
| `api-hooks` → `hooks` | `useDuplicateOmschrijvingCount.ts`, `useVluchtnummerExists.ts`, `useSearchedPoints.ts`, `useSearchedFlightPlans.ts` | `useDebouncedValue` from `hooks/useDebouncedValue` |
| `api-hooks` → `hooks` | `api-hooks/templateFlights/types.ts` | `Geometry` type from `hooks/features/useGeometriesStore` |
| `hooks` → `api-hooks` | `hooks/consts/useGet*.ts` (7 files), `hooks/useGetFlightTimesDistance.ts` | React Query hooks from `api-hooks/` |

**Suggested fix (small, low risk)**

1. Move `useDebouncedValue` to `src/utils/useDebouncedValue.ts` (or `src/shared/hooks/`).
2. Move `Geometry` type to `Types/geometry.ts` (or export from `Types/` and import in both places).
3. Remove thin `hooks/consts/useGet*.ts` wrappers — let components import `api-hooks/consts` directly, **or** rename `hooks/consts` to make direction clear (`api-hooks` must not import back).

**Expected outcome:** Cycle removed; `api-hooks` depends only on `utils` / `Types`.

---

### 2. Cyclic dependency: `src/hooks` ↔ `src/Components/HomePage`

| Field | Value |
|-------|-------|
| Severity | HIGH |
| Status | RAW |
| Source → Target | `src/hooks` → `src/Components/HomePage` (and reverse) |

**How the cycle forms today**

| Direction | Files | Import |
|-----------|-------|--------|
| `hooks` → `HomePage` | `useRenderGeometries.ts`, `useCancelCreateFlightPlan.ts` | `useFlightPlanState` from `.../FlightPlan/helpers/flightPlanStates` |
| `hooks` → `HomePage` | `useRenderVluchtPlans.ts` | `useViewPlanState` from `.../ViewPlan/helpers/useViewPlanState` |
| `hooks` → `HomePage` | `usePopupController.ts` | `createYellowCircle`, `setupClickListener` from `.../PopupModal/` |
| `HomePage` → `hooks` | Many components under `HomePage/` | `hooks/zustand/*`, `hooks/useLogAction`, `hooks/useContent`, feature hooks, etc. |

**Suggested fix (medium effort, high impact)**

1. **Move Zustand state out of component folders** into `hooks/zustand/`:
   - `flightPlanStates.ts` → `hooks/zustand/voorbereiding/useFlightPlanState.ts`
   - `useViewPlanState.ts` → `hooks/zustand/voorbereiding/useViewPlanState.ts`
   - Same pattern for `templateFlightStates.ts`, `usePlanDuplicateState.ts`, etc.
2. **Move popup map helpers** to neutral location:
   - `createYellowCircle.ts`, `setupClickListener.ts` → `helpers/ArcGISHelpers/popup/` or `hooks/popUpModal/helpers/`
3. Update imports in `HomePage` components to new paths (mechanical find-and-replace).

**Expected outcome:** `hooks` no longer imports from `Components/`; cycle broken.

---

## Still open — MEDIUM priority (2 findings)

### 3. High communication density on `src/hooks`

| Severity | MEDIUM | Status | RAW |

Too many cross-module connections into/out of `src/hooks`. This is a **symptom** of the two cycles above plus hooks acting as both “shared logic” and “feature state buried in UI folders.”

**Improve by:**

- Completing HIGH fixes #1 and #2
- Keeping new Zustand stores under `hooks/zustand/<feature>/` consistently
- Avoiding new imports from `Components/` into `hooks/`

---

### 4. High communication density on `src/Components/HomePage`

| Severity | MEDIUM | Status | RAW |

`HomePage` is the largest feature area and imports heavily from `hooks`, `helpers`, and nested local hooks — many bidirectional ties.

**Improve by:**

- Extract shared attachment/image utilities (see LOW #9 below) so fewer deep cross-folder imports
- Prefer colocated hooks only for UI-specific logic; shared logic stays in `src/hooks`
- Split very large sub-trees (e.g. `Voorbereiding`, `Nabewerking`) only if density stays high after cycle fixes

---

## Still open — LOW priority (5 findings)

### 5–8. Moderate communication density

| Component | Severity | Status |
|-----------|----------|--------|
| `src/helpers` | LOW | RAW |
| `src/api-hooks` | LOW | RAW |
| `src/utils` | LOW | RAW |
| `src/Components/TimesliderItemDetailPage` | LOW | RAW |

Normal for actively used shared modules. These should improve automatically when HIGH cycles are fixed. No urgent action unless scores worsen after the main refactors.

---

### 9. Layer bypassing: `TimesliderItemDetailPage` → `hooks` / `helpers`

| Finding | Source | Target |
|---------|--------|----------|
| Transitive dependency | `src/Components/TimesliderItemDetailPage` | `src/hooks` |
| Transitive dependency | `src/Components/TimesliderItemDetailPage` | `src/helpers` |

**Current coupling**

| File | Imports from |
|------|--------------|
| `LoginRequiredModal.tsx` | `hooks/useContent` |
| `useTimesliderImagePageData.ts` | `@helpers/getBackEndUrl`, `@helpers/ZustandStates/useAuth`, `@helpers/timeslider` |
| `useTimesliderImagePageData.ts`, image sections | `Components/HomePage/.../SelectedPlansPointsList/Common/*` (attachment helpers) |

**Suggested fix**

1. Extract shared attachment/image code from `HomePage/.../Common/` to a neutral module, e.g.:
   - `src/features/planAttachments/` or `src/shared/planAttachments/`
   - Move: `usePointPlanImages`, `useGeometryPlanImages`, `pointPlanImagesToAttachments`, `attachmentDisplayUrl`
2. Import from that shared module in both `HomePage` and `TimesliderItemDetailPage`.
3. `useContent` and helper imports are acceptable if layer rules are satisfied elsewhere; the main bypass is **Timeslider → HomePage internals**.

---

## Suggested implementation order

| Phase | Work | Effort | Findings addressed |
|-------|------|--------|-------------------|
| **1** | Move `useDebouncedValue` + `Geometry` type out of `hooks` | ~1 hour | HIGH #1 |
| **2** | Remove or invert `hooks/consts` ↔ `api-hooks` coupling | ~2 hours | HIGH #1, LOW density on `api-hooks` |
| **3** | Relocate Zustand stores from `HomePage` into `hooks/zustand/` | ~4–8 hours | HIGH #2, MEDIUM density |
| **4** | Move popup map helpers out of `HomePage/Body/Common/PopupModal/` | ~1–2 hours | HIGH #2 |
| **5** | Extract plan-attachment shared module for Timeslider | ~2–4 hours | LOW #9, LOW Timeslider density |
| **6** | Re-run Sigrid scan; tune remaining density if needed | — | MEDIUM + remaining LOW |

---

## What you can tell stakeholders

- **9 open entanglement findings** — all developer-owned; no infrastructure dependency.
- **Two HIGH cyclic dependencies** are the root cause; fixing them is the highest-value maintainability work.
- This is **incremental refactoring**, not a rewrite — mostly moving files and updating imports.
- Expect **Maintainability / Architecture scores to move slowly**; Sigrid has many other maintainability rules beyond this CSV. These 9 items are the architecture “entanglement” slice only.

---

## Quick reference — all RAW findings

| # | Severity | Type | Component / path |
|---|----------|------|------------------|
| 1 | HIGH | Cyclic dependency | `src/api-hooks` ↔ `src/hooks` |
| 2 | HIGH | Cyclic dependency | `src/hooks` ↔ `src/Components/HomePage` |
| 3 | MEDIUM | Communication density | `src/hooks` |
| 4 | MEDIUM | Communication density | `src/Components/HomePage` |
| 5 | LOW | Communication density | `src/helpers` |
| 6 | LOW | Communication density | `src/api-hooks` |
| 7 | LOW | Communication density | `src/utils` |
| 8 | LOW | Communication density | `src/Components/TimesliderItemDetailPage` |
| 9 | LOW | Layer bypass | `TimesliderItemDetailPage` → `hooks`, `helpers` |
