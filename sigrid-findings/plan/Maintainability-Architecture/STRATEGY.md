# Maintainability & Architecture — strategy to actually move both stars

Read `ANALYSIS-export-4-to-5.md` and `ANALYSIS-export-3-to-4.md` first. Lesson learned: **refactoring for readability ≠ refactoring for Sigrid.** This plan is built around how Sigrid measures, and around clearing findings **in bulk by pattern**, not file-by-file.

## Sigrid thresholds (observed in export 4) — Definition of Done

A unit only stops being a finding when it is **under** the threshold. Splitting a unit but leaving the pieces over-threshold makes things worse.

| Finding type | Flagged when (lowest risk) | To clear a unit |
|--------------|----------------------------|-----------------|
| **Unit interfacing** | **≥ 3 parameters** | Make it **≤ 2 params** |
| **Unit complexity** | **McCabe ≥ 6** | Get McCabe **≤ 5** |
| **Unit size** | **≥ ~15 LOC** | Keep the unit small, or fewer over-threshold units |
| **Module coupling** | high **fan-in** | Reduce importers / consolidate |
| **Component independence** | hook/module exposes a wide interface | Fewer exported interface modules |

### What inflates McCabe (avoid these chains)
Every `&&`, `||`, `??`, `?.`, ternary, `if`, `case`, `catch`, `for` adds 1.
- ❌ `a ?? b ?? c ?? d` (in a fallback) → ✅ `firstNonEmpty([a,b,c,d], default)` (array literal isn't branching)
- ❌ `s === "1" || s === "ja" || s === "yes"` → ✅ `TRUTHY.has(s)` (a `Set`)
- ❌ deep `obj?.a?.b?.c` repeated → ✅ read once into a local / small typed accessor

### What triggers interfacing (avoid these signatures)
- ❌ `fn(client, plan, idMap, attachments)` → ✅ a **class** holding `client/plan/maps` as fields, methods take 0–1 args
- ❌ `fn(rawRows, mode, mapA, mapB)` → ✅ `fn(client, { rawRows, mode })` (one options object = 1 param)

> Reference implementations (post-fix): `backend/src/helpers/finished-plans/createFinishedPlanDb.ts`, `points/createPointFromImportDb.ts`, `routes/auth/authKeycloak/buildMeResponse.ts`, `services/arcgisTokenConfig.ts`.

## Reality check on effort
- **~1,058** maint+arch findings remaining (export 5).
- Rough expectation: **2.9 → 3.5** likely needs **300–500** findings cleared; **2.2 → 3.0** architecture needs structural change (B2), not unit edits.
- **Export 4 → 5:** −33 maint/arch RAW, stars unchanged — confirms small batches are too slow.
- Therefore: **each execution step must clear ≥100 findings** (see `MAINT-ARCH-PLAN.md` STEP-01…08), using pattern sweeps not file-by-file heroics.

---

## TRACK A — Maintainability (bulk, pattern-based, low risk)

### A1 — Interfacing sweep (**99 remaining in E5**, was 134 in E4)

Param-count distribution (E4): **75 at 3 params**, 39 at 4, 12 at 5, 5 at 6, 3 at 7. Backend largely cleared in E4→E5 (−34).

- **STEP-01 Part B** clears all remaining interfacing together with DUP-01 wizard buttons (265 findings total — both parts ≥100).
- Convert 3-param functions to a single options object → instantly clears the finding.
- For stateful multi-step flows (DB writers, builders), use a small class with fields.
- **Risk:** low (signature-only). **Verification:** build + smoke + re-export.

### A2 — Complexity sweep (241 findings)
Target the chain patterns above. Highest McCabe first (from `maint-arch-MASTER-action-items.csv`):
`createFinishedPlan` (now fixed), `SelectFromSource` (54), `EditPointCoordinates` (46), `useTimesliderImagePageData` (46), `MapComp` (37).
- Replace branch chains with lookup tables / Sets / early returns.
- For React components, extract **pure helper functions** that are themselves ≤5 McCabe and ≤2 params (don't recreate the interfacing problem).

### A3 — Size sweep (569 findings) — do *after* A1/A2
- Only extract when the extracted unit lands **≤ ~15 LOC, ≤ 2 params, ≤ 5 McCabe**, otherwise you trade 1 finding for 2.
- Best ROI inside files already being touched for A1/A2 (no extra QA surface).

### Sequencing for A (per step — not per small PR)

Each step targets **≥100 findings cleared**. See `maint-arch-EXECUTION-STEPS.csv`.

1. Execute current STEP (pattern sweep across whole scope).
2. Build + smoke for that scope.
3. **Re-export Sigrid** — confirm **≥100** RAW drop for the step before advancing.
4. Do **not** relocate files between exports.

---

## Recommended order (export 5)

```
Prep  → WP-07 remark (1 sec RAW; optional parallel)
STEP-01 → DUP-01 + A1 interfacing sweep (265)
STEP-02 → MAINT-03 Voorbereiding A2 (175)
STEP-03 → MAINT-01 backend A2 (236)
STEP-04 → ARCH-03 api-hooks factory (113)
STEP-05 → MAINT-02 + MAINT-07 (136)
STEP-06 → MAINT-08 map hooks + api-hooks (144)
STEP-07 → MAINT-08 remainder (145)
STEP-08 → ArcGIS + dup tail + admin + arch tail (151)
```

Full details: **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)**

---

## TRACK B — Architecture (structural; slower, needs care)

### B1 — Module coupling / high fan-in (24 + ARCH-01)
- `useContent` (fan-in 142), `useLogAction` (116), `classNames`, `fetchApi`, `routeResponses`.
- **Do NOT split true infrastructure** just to lower fan-in — that adds modules and hurts component independence. For genuine utilities, **accept** the fan-in or add a Sigrid annotation.
- Real win: collapse *accidental* hubs — e.g. a hook that re-exports many things others import transitively.

### B2 — Component independence (114) — the largest architecture bucket
By area (E4): helpers 28, hooks/other 25, **api-hooks 21**, hover-click 17, features 6, consts 6.
- The **21 api-hooks** and **6 consts hooks** are near-identical thin query wrappers (`useActiviteiten`, `usePiloten`, …). Each is a separately-flagged interface module.
- **Tactic:** consolidate the const/lookup query hooks behind **one parametrised factory** (e.g. `useLookupQuery(resource)`) so there is one interface module instead of ~12. Same for repetitive api-hooks where feasible.
- **Risk:** medium (touches many call sites) → do as its own PR with full build + smoke.

### B3 — Entanglement (9) — long-term boundaries
- `HomePage ↔ hooks` density, `Timeslider` transitive deps.
- Requires **feature-folder boundaries** (group component + its hooks + helpers; restrict cross-feature imports). Not a single PR — treat as a background initiative once A1/A2 stabilise.

---

## Measurement discipline

- After **each step (≥100 findings):** regenerate plan + run `compare-*-vs-*.py` — confirm targeted RAW count dropped by **≥100**.
- Never relocate files for score reasons.
- A step is not done until the export proves the drop.

## Legacy single-PR guidance (within a step only)

When executing a step, use pattern sweeps inside the scope — not one file per PR.
