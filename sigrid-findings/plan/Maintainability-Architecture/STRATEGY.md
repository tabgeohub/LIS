# Maintainability & Architecture — strategy to actually move both stars

Read `ANALYSIS-export-3-to-4.md` first. Lesson learned: **refactoring for readability ≠ refactoring for Sigrid.** This plan is built around how Sigrid measures, and around clearing findings **in bulk by pattern**, not file-by-file.

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

> Reference implementations (post-fix): `backend/src/helpers/createFinishedPlanDb.ts`, `createPointFromImportDb.ts`, `routes/auth/authKeycloak/buildMeResponse.ts`, `services/arcgisTokenConfig.ts`.

## Reality check on effort
- **~1,091** maint+arch findings across ~1,090 units.
- Rough expectation: **2.9 → 3.5** likely needs **300–500** findings cleared; **2.2 → 3.0** architecture needs structural change, not unit edits.
- Therefore: prioritise **high-count, low-risk patterns** over hand-crafting individual files.

---

## TRACK A — Maintainability (bulk, pattern-based, low risk)

### A1 — Interfacing sweep (134 findings, biggest cheap win)
Param-count distribution (E4): **75 at 3 params**, 39 at 4, 12 at 5, 5 at 6, 3 at 7.

- Convert 3-param functions to a single options object → instantly clears the finding.
- For stateful multi-step flows (DB writers, builders), use a small class with fields.
- Start with the **5–7 param** units (20 findings) — biggest readability + score win — then sweep the 3-param ones folder by folder.
- **Risk:** low (signature-only). **Verification:** build + existing route/UI smoke.

### A2 — Complexity sweep (241 findings)
Target the chain patterns above. Highest McCabe first (from `maint-arch-MASTER-action-items.csv`):
`createFinishedPlan` (now fixed), `SelectFromSource` (54), `EditPointCoordinates` (46), `useTimesliderImagePageData` (46), `MapComp` (37).
- Replace branch chains with lookup tables / Sets / early returns.
- For React components, extract **pure helper functions** that are themselves ≤5 McCabe and ≤2 params (don't recreate the interfacing problem).

### A3 — Size sweep (569 findings) — do *after* A1/A2
- Only extract when the extracted unit lands **≤ ~15 LOC, ≤ 2 params, ≤ 5 McCabe**, otherwise you trade 1 finding for 2.
- Best ROI inside files already being touched for A1/A2 (no extra QA surface).

### Sequencing for A (per PR)
1. Pick one folder (e.g. `backend/src/routes/points`).
2. Apply A1 then A2 then A3 within it.
3. Build + smoke.
4. **Re-export Sigrid and check the per-WP delta** — confirm the count went *down* before moving on (this is the step we skipped before).

---

## TRACK B — Architecture (structural; slower, needs care)

Architecture barely responds to unit edits and can regress when you add modules. Tackle it deliberately.

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

## Recommended order

```
1. A1 interfacing sweep — backend first (points, finished_plans, geometries), then frontend helpers
2. A2 complexity sweep  — alongside A1 in the same folders
3. Re-export → verify counts drop (gate before continuing)
4. B2 consolidate const/api-hook query wrappers (factory)  ← biggest architecture lever
5. A3 size sweep within already-touched files
6. B1 fan-in: accept/annotate infra; collapse accidental hubs
7. B3 entanglement: feature-folder boundaries (long-term)
```

## Measurement discipline (the fix for "no noted change")
- After **every** batch: `python sigrid-findings/plan/generate-plan.py` against the newest export, then `python sigrid-findings/compare-3-vs-4.py` (update folder names) and confirm the targeted WP's RAW count **decreased**.
- Never relocate files for score reasons — it churns issue age for zero gain.
- A PR that doesn't lower a finding count (or lowers complexity below threshold) isn't done.
