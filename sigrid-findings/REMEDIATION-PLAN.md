# Sigrid Findings Remediation Plan — LIS

## Current state

The immutable baseline export from July 13, 2026 is in [`sigrid findings/`](./sigrid%20findings/). The intermediate July 14 export is retained in [`sigrid-findings-new/`](./sigrid-findings-new/). The latest July 14 export is in [`sigrid-findings-2/`](./sigrid-findings-2/) and is the source of truth for further remediation.

| Category | Baseline RAW | Latest RAW | Severity change |
| --- | ---: | ---: | --- |
| Duplication | 147 | 105 | HIGH 147 → 105 |
| Unit size | 683 | 670 | HIGH 17 → 4; MEDIUM 214 → 200; LOW 452 → 466 |
| Component independence | 106 | 116 | HIGH 29 → 27; MEDIUM 77 → 89 |
| Unit complexity | 241 | 241 | MEDIUM 55 → 46; LOW 186 → 195 |
| Unit interfacing | 38 | 49 | MEDIUM 1 → 3; LOW 37 → 46 |
| Module coupling | 30 | 29 | HIGH remains 2; MEDIUM 12 → 13; LOW 16 → 14 |
| Component entanglement | 9 | 9 | MEDIUM remains 2; LOW remains 7 |
| Security | 3 | 3 | HIGH 2; MEDIUM 1 |
| Reliability | 0 | 0 | Clean |

Compared with the immediately preceding export, HIGH duplication fell from 119 to 105 and total unit-size findings fell from 683 to 670. MEDIUM unit complexity remains 46, HIGH unit size remains 4, and HIGH component independence remains 27. Component independence gained three MEDIUM findings, while module coupling shifted one finding from LOW to MEDIUM; these are backlog changes, not new HIGH findings.

All remediation must remain behavior-preserving and uncommitted for review. Do not push, create branches, edit Dockerfiles, edit Nginx or other deployment files, change database schemas, or change HTTP contracts.

---

## Phase 0 — Security disposition

Source: [`Security findings.csv`](./sigrid-findings-2/Security%20findings.csv).

- `dockerfile` and `backend/dockerfile` still have two HIGH missing-user findings. They are explicitly out of scope because deployment files must remain untouched. Record them as accepted deployment-boundary findings.
- The MEDIUM XSS finding in `pointsPlansTableExport.ts` is a false positive. The flagged function creates escaped CSV cells and has no HTML or DOM sink. Accept it in Sigrid; no further source change is planned.
- Reliability remains clean and requires no remediation.

---

## Phase 1 — Remaining HIGH duplication

Sources: [`Duplication findings.csv`](./sigrid-findings-2/Duplication%20findings.csv) and [`Duplicates.csv`](./sigrid-findings-2/Duplicates.csv). Use `Duplicates.csv` IDs so overlapping clones are counted once.

Phase 1 has reduced HIGH duplication from 147 to 119 and now to 105. Between the two July 14 exports, 43 previous IDs disappeared, 29 IDs appeared or were resegmented, and 76 IDs were retained. ID churn can result from changed line boundaries, so the net reduction of 14 is the reliable progress measure; newly assigned IDs are not automatically regressions.

The latest export confirms the previous implementation batch removed the targeted flight-plan form selection, edit-point props, add-points input destructuring, ZIP feature construction, table frames, route configuration, filter adapters, selection panels, token server catalogues, plan-information fields, point/geometry SQL assignments, and email update/delete clones. Phase 1 remains open because 105 HIGH findings remain.

### Next implementation batches

Implement in this order, then re-scan after each coherent batch:

1. **Shared list and card presentation**
   - Consolidate plan filtering and sorting (`2fd4f9f6`).
   - Reuse feature-specific plan cards across search, report, removal, and single-plan views (`c06024a2`, `e6ff0ccc`, `196519b1`).
   - Share the ResultTab point-list controller and rendering blocks (`43f699c5`, `70ba670d`).
   - Consolidate the remaining edit-point step wrappers where their behavior is identical (`b9eb3c55`, `e74ba67b`).

2. **Wizard steps, filters, and form mappings**
   - Share the identical template-flight and add-points step panels without creating a universal wizard abstraction (`65d39d71`, `8e662a6d`, `f4395e70`, `50849372`).
   - Extract a reusable Zustand filter slice for the remaining plan/point filter stores (`52508c7c`, `b72b04eb`).
   - Consolidate coordinate watching and add-point map-click helpers while preserving graphics ownership and cleanup (`3a798735`, `0bdedbdc`, `b2469c15`).
   - Centralize the remaining same-package flight-plan field/reset/mapping sequences (`2a1281cc`, `537ba8dc`, `ff4cccfd`, `f6e756b3`).

3. **Backend, report, and map helpers**
   - Share template-plan name validation and duplicate-name handling (`cd74756b`, `d25e422a`).
   - Consolidate report point/geometry processing and attachment task construction (`2a2be971`, `2334d883`).
   - Reuse finished-plan point filtering (`ded0a86a`).
   - Consolidate owned graphics-layer order and repeated point-symbol builders where behavior is identical (`671011ee`, `9e2ea709`, `78bf68ca`).

4. **Fresh-export remainder**
   - Re-rank the remaining IDs by redundant lines after the first three batches.
   - Consolidate wizard button arrays only when labels, order, disabled rules, navigation, submission, logging, and cleanup semantics are all identical.
   - Prefer small feature-specific helpers over broad abstractions that obscure domain behavior.

### Accepted or conditionally accepted duplication

Keep these documented rather than creating frontend/backend coupling:

- `dccadda6-9f79-430a-860a-25065273cbbf`: frontend point column keys and backend point core columns are declarative structures in separate build contexts.
- `e693dac9-7ed2-47cf-b948-d3c375fc612b`: Keycloak user structures cross the frontend/backend boundary.
- `8b0a205d-522f-49af-9f47-1b171a3b7605` and `c08a36ac-e8a1-46c2-9c61-cc66660681ac`: device structures cross that same boundary.
- `4f1487b1-abfe-413f-be8f-1c5ed6fb591b`: installer route and frontend structures cannot share a module without a new shared package.
- `f3d07418-51d0-4c04-b130-ead06b0815cd`: finished-point structures cross separate build contexts.
- `6cf934e6-f39f-4fce-9b00-0a416bdf3310`, `0868f160-eec7-4a6a-8e3b-61bdff176b0b`, and `eaa832fb-9b06-4885-a80a-cf03754ac8ab`: accept only cross-package occurrences of point/geometry field sequences; same-package occurrences remain actionable.
- `dac91103-8f36-4874-bc1b-0d908536685c`: the Netherlands layer builders are declarative ArcGIS catalogue data.

The following are accepted stable façades where the implementation is already centralized and only short calls or option blocks remain:

- `f01a3a56-d937-4773-8c8f-e23911f5b768`: flight-plan list route façades.
- `82fe3e99-bd05-41af-baff-556b83e76c7a`: timeslider route façades.
- `ed947076-aec7-4f71-b87b-3cd64823e4f2`: constant-query route façades.
- `d1a0d89f-a40c-4f99-8a4e-706671f13ead`: compatible public returning-update wrappers.

Do not automatically accept short UI adapters. First verify that their submission, cancellation, cleanup, and state ownership differ; accept them only when merging would hide those differences.

After each batch, run both production builds, targeted tests, affected manual workflows, and compare a fresh immutable export with `sigrid-findings-2` using [`compare-exports-pair.py`](./compare-exports-pair.py).

---

## Phase 2 — HIGH unit size and component independence

Phase 2 remains complete for actionable executable findings.

The four remaining HIGH unit-size findings are accepted declarative data:

- `nnederlandLayerSpecsPart1.ts`
- `nnederlandLayerSpecsPart2.ts`
- `nnederlandLayerSpecsPart3.ts`
- `voorbereidingTabs.ts`

Each has McCabe complexity 1. Splitting these catalogues solely to lower the metric would make them harder to review.

The 27 remaining HIGH component-independence findings are small cohesive hooks, query groups, utilities, or compatibility façades. Keep these stable boundaries unless a future scan shows bundled responsibilities. The three additional findings in this category are MEDIUM, bringing the MEDIUM total to 89; they belong to the long-tail review and do not reopen Phase 2 by themselves.

---

## Phase 3 — MEDIUM complexity and parameter cleanup

Source: [`Unit complexity findings.csv`](./sigrid-findings-2/Unit%20complexity%20findings.csv). The MEDIUM count remains 46. Address findings from highest McCabe complexity downward:

1. Decompose `TimesliderItemDetailPage` and `LegendSection` into state/controller logic and focused presentation sections.
2. Simplify timeslider status/view builders with named predicates and lookup tables while preserving status precedence and rendered output.
3. Split `filterPoints` and flight-plan form population into independent filter/mapping steps with early returns.
4. Extract event resolution and response construction from `FeatureLayerPopup` and `usePathPointHandlerClick`.
5. Continue with export, import parsing, grant-error parsing, login validation, geometry creation, image handling, Keycloak lookup, and path drawing in descending complexity order.

Source: [`Unit interfacing findings.csv`](./sigrid-findings-2/Unit%20interfacing%20findings.csv). The three MEDIUM parameter-count findings remain and should use typed options objects:

- the six-parameter login-failure logger;
- the five-parameter finished-plan highlight drawing helper;
- the five-parameter geometry coordinate builder.

Keep return values, authentication decisions, logging event names, map symbols, and public hook imports compatible.

The two HIGH module-coupling findings, `useLogAction` and `useContent`, remain accepted high-fan-in application services. Both are cohesive and intentionally shared; splitting them would distribute coupling rather than remove it.

---

## Phase 4 — Current long tail

Re-scan after Phases 1 and 3 before starting this phase. The latest lower-severity backlog is:

- 200 MEDIUM and 466 LOW unit-size findings;
- 195 LOW unit-complexity findings;
- 46 LOW unit-interfacing findings;
- 89 MEDIUM component-independence findings;
- 13 MEDIUM and 14 LOW module-coupling findings;
- 2 MEDIUM and 7 LOW component-entanglement findings.

Continue the established patterns: focused helpers for executable units, typed options objects for related parameters, stable façades for public imports, and explicit acceptance for cohesive high-fan-in or declarative modules. Prioritize real complexity and coupling reduction over file-count growth.

---

## Unified implementation pass — awaiting deployment scan

The coordinated all-phase implementation pass is now present in the uncommitted working tree. Because clone IDs and unit boundaries change after extraction, the following findings are **addressed pending Sigrid confirmation**, not locally declared closed:

- Plan filtering/cards and ResultTab lists: `2fd4f9f6`, `c06024a2`, `e6ff0ccc`, `196519b1`, `43f699c5`, `70ba670d`.
- Template steps, filters, and form mappings: `65d39d71`, `8e662a6d`, `52508c7c`, `b72b04eb`, `2a1281cc`, `f6e756b3`, `ff4cccfd`, `6f5b6e86`.
- Backend/template/report helpers: `cd74756b`, `d25e422a`, `2334d883`, `ded0a86a`.
- Map/list presentation and searched-result menus: `671011ee`, `22448eed`, `5eeb7b60`, `cefe643d`, `d1e121b1`, `3ff7f54c`.

The pass also decomposes the executable units previously reported for the timeslider detail page, `LegendSection`, `FeatureLayerPopup`, point filtering, path-point clicks, Keycloak lookup, login error mapping, point list items, timeslider plan selection, page navigation, image marker construction, and ViewPlan Step 2 map behavior.

All three MEDIUM parameter-count findings are addressed: login-failure logging now takes an options object, finished-plan highlight drawing is scoped through its action factory, and geometry coordinate conversion takes the points collection plus one optional transform callback.

Lower-severity review disposition:

- Executable units with separable state, transformation, map, and rendering responsibilities were split into feature-local helpers/controllers.
- McCabe-1 data catalogues, type declarations, configuration/route composition roots, HTML entry points, and query builders with one cohesive responsibility are accepted.
- Small interface modules and compatibility façades remain accepted supported import boundaries.
- `useLogAction`, `useContent`, and the other high-fan-in cohesive services remain accepted; splitting them would distribute rather than reduce coupling.
- Directory-level communication-density findings for `src/Components/HomePage`, `src/hooks`, and their helper dependencies are accepted architectural aggregation. Moving files solely to alter Sigrid component boundaries is not an application-quality improvement.

A new deployment export is required to change any `addressed pending confirmation` entry to `closed`, identify resegmented clones, and perform the final residual cleanup pass.

## Verification and measurement

For application-code batches:

1. Run the frontend production build and backend TypeScript build.
2. Run all existing authentication tests plus focused tests for the changed subsystem.
3. Manually exercise the affected map, table, wizard, export, or authentication workflows.
4. Confirm `dockerfile`, `backend/dockerfile`, both Nginx files, database schemas, and HTTP request/response shapes are unchanged.
5. Run `git diff --check` and leave all changes uncommitted and unpushed.
6. Place each future Sigrid export in a new immutable directory. Never edit or remove prior exports.
7. Compare future exports against `sigrid-findings-2` by duplication ID and category/severity totals using `compare-exports-pair.py` in an environment with Python available.

For documentation-only updates, verify Markdown links, export hashes, protected-file diffs, and `git diff --check`; application builds are not required.

## Reuse and compatibility rules

- Reuse existing Common components, `WizardButtonBar`, query builders, map graphic builders, and typed `*Options` patterns.
- Do not introduce a shared frontend/backend package during behavior-preserving remediation.
- Do not change UI labels, button order, disabled conditions, cleanup ownership, map symbols, logging messages, export filenames, SQL parameters, or response JSON shapes.
- Document every accepted finding with its ID and rationale when Sigrid provides an acceptance mechanism or stable identifier.
