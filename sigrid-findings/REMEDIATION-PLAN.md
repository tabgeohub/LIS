# Sigrid Findings Remediation Plan — LIS

## Current state

The immutable baseline export from July 13, 2026 is in [`sigrid findings/`](./sigrid%20findings/). The current export from July 14, 2026 is in [`sigrid-findings-new/`](./sigrid-findings-new/) and is the source of truth for further remediation.

| Category | Baseline RAW | Current RAW | Severity change |
| --- | ---: | ---: | --- |
| Duplication | 147 | 119 | HIGH 147 → 119 |
| Unit size | 683 | 683 | HIGH 17 → 4; MEDIUM 214 → 207 |
| Component independence | 106 | 113 | HIGH 29 → 27 |
| Unit complexity | 241 | 240 | MEDIUM 55 → 46 |
| Unit interfacing | 38 | 49 | MEDIUM 1 → 3 |
| Module coupling | 30 | 29 | HIGH remains 2 |
| Component entanglement | 9 | 9 | MEDIUM remains 2 |
| Security | 3 | 3 | HIGH 2; MEDIUM 1 |
| Reliability | 0 | 0 | Clean |

The refactors reduced the most serious unit-size and complexity findings, but Phase 1 is not complete: 119 HIGH duplication findings remain. All changes must remain behavior-preserving and uncommitted for review. Do not push, create branches, edit deployment files, change database schemas, or change HTTP contracts.

---

## Phase 0 — Security disposition

Source: [`Security findings.csv`](./sigrid-findings-new/Security%20findings.csv).

- `dockerfile` and `backend/dockerfile` still have two HIGH missing-user findings. They are explicitly out of scope because Dockerfiles, Nginx, and other deployment files must not be modified. Record them as accepted deployment-boundary findings rather than changing the repository.
- The MEDIUM XSS finding in `pointsPlansTableExport.ts` is a false positive. The flagged function creates escaped CSV cells and has no HTML or DOM sink. The source already contains a suppression explanation; accept the finding in Sigrid rather than changing working CSV behavior again.
- Reliability has no open findings and needs no remediation.

---

## Phase 1 — Remaining HIGH duplication

Sources: [`Duplication findings.csv`](./sigrid-findings-new/Duplication%20findings.csv) and [`Duplicates.csv`](./sigrid-findings-new/Duplicates.csv). Use the IDs in `Duplicates.csv` so overlapping clones are counted once.

The first Phase 1 pass closed 28 findings, from 147 to 119. Continue in behavior-preserving batches ordered by redundant lines:

1. Consolidate identical flight-plan button definitions only where labels, order, disabled rules, navigation, submission, and cleanup semantics match. Continue using `WizardButtonBar`; do not introduce a universal wizard abstraction.
2. Centralize repeated point and flight-plan field sequences in typed frontend constants/builders. Keep separate backend constants where build boundaries differ.
3. Route the four flight-plan list handlers through their existing shared query configuration instead of repeating route-level option blocks.
4. Extract feature-specific table header/layout and tab-header presentation blocks shared by the point, geometry, and flight-plan tables.
5. Reuse one edit-point step wrapper for the Tools and Voorbereiding flows while retaining their different store adapters and labels.
6. Extract the remaining same-file XLSX/export row builder clone in `pointsPlansTableExport.ts`.
7. Review the remaining filter, coordinate-watcher, token-server, and result-tab clones by ID after each batch, because one extraction may close several overlapping findings.

### July 14 implementation batch

The following July 14 findings have now been addressed in the working tree and require confirmation by the next immutable Sigrid export:

- `e7e6db51-c848-4677-95be-113c92fa071d`: flight-plan form values are selected by one typed helper.
- `0faa85fb-81c8-4fe0-b54e-941e26aa3108`: both edit-point map steps share one props contract.
- `a69a498a-d56e-42b5-8e64-8468bd4dd4b2`: add-points submission consumes its input object without restating the complete field list.
- `c7e3764d-011e-4a0f-8c66-5432fb7ce199`: point export feature construction is shared by Shapefile and GeoJSON ZIP exports.
- `69b8b926-d91e-41a5-89ea-199f22f3de02`: point, geometry, and flight-plan tables use one table frame.
- `173fce86-b119-4cac-ae77-c25236ef0ac0`: the four regional flight-plan list routes use one shared route configuration.
- `ef8feed0-1487-4a5a-af8a-151f1a242f8b`, `7885ab43-c150-48d8-b742-b84494bdecbc`, and `2fab6676-4bae-40d0-b3e1-145cd0cfe2ea`: filter inputs and selects are thin adapters over the existing common controls.
- `cc74972f-d376-467f-adde-e7eb9ffff173`: point/geometry selection filters use one configurable panel.
- `880736fd-41a8-477c-badb-8ac0d3d58d21` and `bd048923-9271-40fa-bdac-4ca53ea6cd9e`: ArcGIS token refresh and registration use one server catalogue.
- `d0c828c0-ede2-41f5-b3e5-5f3c62eb11c3`: plan-information fields use one presentation component while preserving each flow's urgent-value display.
- `232aff57-b05f-4ade-b517-2e87dcf21baf`: point and geometry-owned-point updates share typed SQL assignments and parameter ordering.
- `ca55656a-3db3-48b6-a277-1dcbb1c3fb65`: email update/delete routes use the common returning-update executor.

The repeated filter reset, frontend point payload field selection, XLSX buffer creation, and geometry repeat normalization were also consolidated. Do not mark Phase 1 complete until a new export confirms which overlapping IDs disappeared.

Accept rather than merge:

- the duplicated Keycloak user shape across frontend and backend build contexts;
- declarative domain field lists where consolidation would hide meaning or create cross-package coupling;
- superficially similar UI or cleanup flows with different behavior.

Stable accepted IDs from the July 14 export:

- `e693dac9-7ed2-47cf-b948-d3c375fc612b`: Keycloak user structures live in separate frontend and backend build contexts.
- `c08a36ac-e8a1-46c2-9c61-cc66660681ac` and `8b0a205d-522f-49af-9f47-1b171a3b7605`: device structures cross the same package boundary.
- `4f1487b1-abfe-413f-be8f-1c5ed6fb591b`: installer route and frontend structure cannot share a module without introducing a package boundary.
- `6cf934e6-f39f-4fce-9b00-0a416bdf3310`: backend geometry JSON fields and frontend point columns are independent declarative sequences.
- `dac91103-8f36-4874-bc1b-0d908536685c`: the Netherlands layer builders intentionally construct two different ArcGIS layer classes behind a stable catalogue boundary.

After each batch, run both production builds, targeted tests, affected manual workflows, and compare a fresh export with the current one using [`compare-exports-pair.py`](./compare-exports-pair.py).

---

## Phase 2 — HIGH unit size and component independence

Phase 2 is complete for actionable executable findings.

The four remaining HIGH unit-size findings are accepted declarative data:

- `nnederlandLayerSpecsPart1.ts`
- `nnederlandLayerSpecsPart2.ts`
- `nnederlandLayerSpecsPart3.ts`
- `voorbereidingTabs.ts`

These catalogues have negligible branching; splitting them solely to lower the metric would make them harder to review.

The 27 remaining HIGH component-independence findings are small, cohesive hooks, query groups, utilities, or compatibility façades. Examples include `usePlanStarGraphic`, `syncBluePointGraphics`, `useMapInitialization`, the domain query modules, `useLogAction`, and `refreshToken`. Keep these stable boundaries unless a future scan or code change shows that a module has acquired unrelated responsibilities. Do not keep moving implementation between tiny files to game the metric.

---

## Phase 3 — MEDIUM complexity and parameter cleanup

Source: [`Unit complexity findings.csv`](./sigrid-findings-new/Unit%20complexity%20findings.csv). Address the 46 MEDIUM findings from highest McCabe complexity downward:

1. Decompose `TimesliderItemDetailPage` and `LegendSection` into state/controller logic and focused presentation sections.
2. Simplify the timeslider status/view builders with named predicates and lookup tables while preserving status precedence and rendered output.
3. Split `filterPoints` and flight-plan form population into independent filter/mapping steps with early returns.
4. Extract event resolution and response construction from `FeatureLayerPopup` and `usePathPointHandlerClick`.
5. Continue with export, import parsing, grant-error parsing, login validation, geometry creation, image handling, Keycloak lookup, and path drawing in descending complexity order.

Source: [`Unit interfacing findings.csv`](./sigrid-findings-new/Unit%20interfacing%20findings.csv). Fix the three MEDIUM findings with typed options objects:

- the six-parameter login-failure logger;
- the five-parameter finished-plan highlight drawing helper;
- the five-parameter geometry coordinate builder.

Keep return values, authentication decisions, logging event names, map symbols, and public hook imports compatible.

The two HIGH module-coupling findings, `useLogAction` and `useContent`, are accepted high-fan-in application services. Both are cohesive and intentionally shared; splitting them would distribute coupling rather than remove it.

---

## Phase 4 — Current long tail

Re-scan after Phases 1 and 3 before starting this phase. The current lower-severity backlog is:

- 207 MEDIUM and 472 LOW unit-size findings;
- 194 LOW unit-complexity findings;
- 46 LOW unit-interfacing findings;
- 86 MEDIUM component-independence findings;
- 12 MEDIUM and 15 LOW module-coupling findings;
- 2 MEDIUM and 7 LOW component-entanglement findings.

Continue the established patterns: focused helpers for executable units, typed options objects for related parameters, stable façades for public imports, and explicit acceptance for cohesive high-fan-in or declarative modules. Prioritize real complexity and coupling reduction over file-count growth.

---

## Verification and measurement

For application-code batches:

1. Run the frontend production build and backend TypeScript build.
2. Run all existing authentication tests plus focused tests for the changed subsystem.
3. Manually exercise the affected map, table, wizard, export, or authentication workflows.
4. Confirm `dockerfile`, `backend/dockerfile`, both Nginx files, database schemas, and HTTP request/response shapes are unchanged.
5. Run `git diff --check` and leave all changes uncommitted and unpushed.
6. Place each future Sigrid export in a new immutable directory. Do not edit prior exports. Compare exports by duplication ID and category/severity totals using `compare-exports-pair.py` in an environment with Python available.

For documentation-only updates, verify links, export hashes, protected-file diffs, and `git diff --check`; application builds are not required.

## Reuse and compatibility rules

- Reuse existing Common components, `WizardButtonBar`, query builders, map graphic builders, and typed `*Options` patterns.
- Do not introduce a shared frontend/backend package during behavior-preserving remediation.
- Do not change UI labels, button order, disabled conditions, cleanup ownership, map symbols, logging messages, export filenames, SQL parameters, or response JSON shapes.
- Every accepted finding must be documented with its rationale when Sigrid provides an acceptance mechanism or stable identifier.
