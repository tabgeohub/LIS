# Sigrid Findings Remediation Plan — LIS

## Context

Sigrid (SIG's code-quality/security platform) scanned the LIS repo. The current export lives in
[`sigrid findings/`](./sigrid%20findings/) as 11 CSVs. Analysis of those CSVs shows:

- **Security / Reliability are essentially clean.** Almost every finding is already `FIXED` (SQL-injection, SSRF,
  open-redirect, vulnerable deps xlsx/multer/undici/nodemailer). Only **3 items are still `RAW` (open)**.
- **The real backlog is maintainability**, all `RAW`: **147 HIGH duplication**, **~190 unit-size** (15 HIGH),
  **181 unit-complexity** (40 MEDIUM), **106 component-independence** (29 HIGH), **30 module-coupling** (2 HIGH),
  **9 component-entanglement**, plus unit-interfacing (parameter counts).

Goal (scope = **Everything**): close the 3 open security items, then work the maintainability backlog in
severity waves (HIGH → MEDIUM → LOW) until Sigrid re-scan shows the ratings improved. Each wave is independently
shippable so we can re-export and measure progress with the existing
[`compare-exports-pair.py`](./compare-exports-pair.py) once an `exported-findings-8/` exists.

Guiding rule: **behavior-preserving refactors only.** No feature changes. Every wave ends with typecheck + build + the
app running (see Verification).

---

## Phase 0 — Open security items (fast, do first)

Only 3 findings are still `RAW` in [`Security findings.csv`](./sigrid%20findings/Security%20findings.csv):

1. **Missing `USER` instruction (CWE-266), HIGH** — `backend/dockerfile:4` and root `dockerfile:22`.
   Container runs as root. Fix: add a non-root user in the runtime stage of each Dockerfile, e.g. after deps are
   installed and files copied:
   ```dockerfile
   RUN groupadd -r app && useradd -r -g app app \
    && chown -R app:app /usr/src/app
   USER app
   ```
   Place `USER app` before `CMD`. Verify the app still boots (Chromium/Puppeteer in the backend image runs fine as
   non-root; it already uses system `/usr/bin/chromium`).

2. **XSS in CSV export (CWE-79), MEDIUM** — `src/helpers/tableExports/pointsPlansTableExport.ts:18`.
   **This is a false positive.** The flagged code is `escapeCsvCell` / `buildCsvFromRows` — a CSV/spreadsheet builder,
   not HTML. There is no HTML sink, `innerHTML`, or DOM write in the file. Action: add a `// nosemgrep: <rule-id>`
   suppression comment on the flagged line with a one-line justification, and mark it a false positive in Sigrid.
   Do **not** restructure working CSV-escaping logic.

**Deliverable:** 2 Dockerfiles edited, 1 suppression comment. Re-export → these drop off the Security board.

---

## Phase 1 — HIGH duplication (147 findings) — highest leverage

Source: [`Duplication findings.csv`](./sigrid%20findings/Duplication%20findings.csv). Clones cluster into a
few repeatable patterns; fixing the pattern kills many findings at once.

**1a. Wizard `Buttons.tsx` / `Form.tsx` clones (biggest cluster).**
Repeated Back/Next/Submit button blocks and form-field blocks across the step wizards, e.g.
`.../DrawingTool/Step2/Form.tsx`, `.../EnrichedAddPoint/Steps/Step3/Form.tsx`, `.../ViewPlan/Steps/Step2/Buttons.tsx`,
`.../Nabewerking/.../EditFlight/Buttons.tsx`.
Action: extract shared **`WizardStepButtons`** and **`WizardPointFormFields`** components into
`src/Components/HomePage/Body/Left/Common/` (co-locate with the existing `WizardPointsList.tsx`) and replace each clone
with the shared component + props.

**1b. Map-effect hook clones.**
`useAddPointToPlanMapEffects.ts`, `useSelectFromSourceMapEffects.ts`, `useStepContentMapSync.ts` share 10–13-line
effect bodies. Extract a shared hook (e.g. `useStepMapSyncEffect`) in `src/hooks/` and call it from each.

**1c. Self-duplication inside one file.**
`useEnrichedPointState.ts` (17-line and 14-line blocks twice), `runReturningUpdate.ts`,
`pointsPlansTableExport.ts` (L225/L262). Extract a local helper and call it twice.

**1d. Shared type duplication.**
`src/Types/keycloakUser.ts` vs `backend/src/routes/keycloak/management/users/types.ts` (11 identical lines), and
`templateFlightStates.ts` vs `useFlightPlanState.ts`. Where a type is duplicated front/back, define once and import;
where they can't share a module (front vs back), accept it or generate from a single source.

**1e. Backend query/route clones.**
`formatPlanGeometries.ts` vs `getGeometries.ts`; `buildPointUpdatePayload.ts` vs `updateGeometryPointsComment.ts`.
Extract shared query/format helpers into the existing `backend/src/helpers/queries/` tree.

Work file-pair by file-pair from the CSV top (largest `Redundant lines of code` first). Re-run the app after each
cluster.

---

## Phase 2 — HIGH unit size & HIGH component independence

**2a. Unit size HIGH (15)** — [`Unit size findings.csv`](./sigrid%20findings/Unit%20size%20findings.csv).
Split each >65-line unit into named helpers. Representative targets:
- `src/Components/HomePage/Body/Bottom/PointsView/usePointsViewController.ts` (117 LOC)
- `backend/src/routes/auth2/verifyCredentialsHandler.ts` (102 LOC, McCabe 21 — also Phase 3)
- `src/helpers/ArcGISHelpers/createMapView.ts` (86 LOC)
- `backend/src/services/getKeycloakAdminToken.ts` (83 LOC, McCabe 20)
- `nnederlandLayerSpecsPart1/2/3.ts` — these are data-spec files; split the spec arrays into smaller grouped modules.

**2b. Component independence HIGH (29)** — [`Component independence findings.csv`](./sigrid%20findings/Component%20independence%20findings.csv).
"Interface module with N lines" = hooks in `src/hooks/` exposing too much surface. Targets include
`useFlightPlanQuery.ts` (111), `useEntityQuery.ts` (87), `useEditGeometryVerticesOnMap.ts` (77), `useRenderGeometries.ts`,
`useLogAction.ts`, `useGetFlightTimesDistance.ts`. Reduce the exported/public surface: move pure helpers out of the hook
into a sibling non-hook module so the hook file itself shrinks, and narrow what each hook returns to what callers use.

These two overlap heavily with the same files (a big hook is both "too large" and "too much interface"), so do them
together per file.

---

## Phase 3 — MEDIUM complexity + HIGH module coupling

**3a. Unit complexity MEDIUM (40)** — [`Unit complexity findings.csv`](./sigrid%20findings/Unit%20complexity%20findings.csv).
Highest McCabe first: `verifyCredentialsHandler` (21), `getKeycloakAdminToken` (20), `filterPoints` (20),
`TimesliderItemDetailPage` (23), `LegendSection` (22), `usePathPointHandlerClick` (18), `FeatureLayerPopup` (18).
Reduce branching: extract guard/early-return helpers, replace nested `if/else` chains with lookup maps or small
`classify*` functions (the auth2 code already has `classifyStep2OtpLoginFailure` as a model to follow).

**3b. Module coupling HIGH (2)** — [`Module coupling findings.csv`](./sigrid%20findings/Module%20coupling%20findings.csv).
`useLogAction.ts` (fan-in 98) and `useContent.ts` (fan-in 123). These are hubs imported everywhere. Don't force this —
high fan-in on a genuinely shared utility is often acceptable. Only act if the module bundles unrelated concerns; then
split it so callers import just what they need. Otherwise mark as accepted risk in Sigrid with a rationale.

---

## Phase 4 — MEDIUM/LOW long tail

Work these in bulk, lowest-risk mechanical changes, re-exporting periodically to track the rating:

- **Unit size MEDIUM (173) / LOW (354):** continue the Phase-2 split pattern down the severity list.
- **Unit complexity LOW (141):** same as 3a at smaller scale.
- **Unit interfacing (all LOW/MEDIUM):** functions with 3–5 params. Bundle related params into a single typed options
  object (the codebase already uses this pattern, e.g. `CreateGeometryGraphicOptions`, `BuildFlightPlanQueryOptions`).
- **Module coupling MEDIUM/LOW (28) & Component entanglement (9):** mostly `COMMUNICATION_DENSITY` /
  `LAYER_BYPASSING_DEPENDENCY` on `src/hooks`, `src/helpers`, `src/utils`, `src/Components/HomePage`. Address the
  layer-bypassing transitive deps (`src/hooks → src/utils`, `TimesliderItemDetailPage → src/hooks/helpers`) by routing
  through the proper layer; density findings largely resolve as Phases 1–2 shrink the hot components.

Many long-tail findings will disappear automatically as Phases 1–3 land, so re-measure before grinding through the
remainder.

---

## Execution & measurement loop

1. Do a wave (or a cluster within a wave).
2. `cd backend && npm run build` and root `npm run build` + typecheck; run the app (Verification below).
3. Commit the wave on the `maintain` branch with a message naming the finding category.
4. When a batch is done, request a fresh Sigrid export, drop it in `sigrid-findings/exported-findings-8/`, and run
   `python "sigrid-findings/compare-exports-pair.py" "sigrid findings" exported-findings-8` to confirm findings dropped
   and no regressions appeared.

## Verification

- **Typecheck/build (both packages):** root `npm run build` and `backend/ npm run build` must pass after every wave.
- **Lint:** run the repo linter if configured; refactors must not introduce new warnings.
- **Run the app end-to-end:** load the HomePage map, exercise a flight-plan wizard (the Voorbereiding step flow touched
  in Phase 1), do a CSV/XLSX export (Phase 0 file), and a login/auth2 flow (Phase 3 files). Confirm no behavioral change.
- **Security spot-check Phase 0:** build both Docker images, run the backend container, confirm it starts as non-root
  (`whoami` → `app`) and Puppeteer PDF generation still works.
- **Regression safety:** since these are behavior-preserving, prefer extracting to shared units that are covered by
  existing usage; if a refactor touches auth, verify login manually before committing.

## Critical files / utilities to reuse (don't reinvent)

- `src/helpers/tableExports/pointsPlansTableExport.ts` — already has `escapeCsvCell` (RFC-4180 + formula-injection
  safe); reuse, don't rewrite.
- `src/Components/HomePage/Body/Left/Common/` — home for shared wizard components (`WizardPointsList.tsx` precedent).
- `backend/src/helpers/queries/` — home for shared backend query/format helpers.
- Existing `*Options` typed-param objects — the established pattern for fixing unit-interfacing findings.
- [`compare-exports-pair.py`](./compare-exports-pair.py) — progress measurement between exports.
