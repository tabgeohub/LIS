# Sigrid Remediation Plan — Code only

**Source:** `exported-findings-7` · **Generated:** 2026-07-13

Application code, dependencies, and maintainability. **DevOps (Docker) is in [`devops/`](./devops/) — out of scope for code sprints.**

## Current state (`exported-findings-7`)

| Metric | Value |
|--------|------:|
| Security + Reliability (code) RAW | **2** |
| Security + Reliability FIXED (code) | 48 |
| Maintainability RAW | 1082 |
| Duplication RAW | 191 |

**Dashboard (export 7):** Security 4.1 · Reliability 5.5 · OSS Health 4.7 · Maintainability **3.2** · Architecture **2.3**

Last measured delta: [ANALYSIS-export-6-to-7.md](./Maintainability-Architecture/ANALYSIS-export-6-to-7.md) (HIGH −6, dup −18, both stars +0.1).

## Completed (STEPS 01–08 + security WPs)

| ID | Name |
|----|------|
| WP-01 | Backend deps (multer, undici, nodemailer) |
| WP-02 | Frontend xlsx → `@e965/xlsx` |
| WP-05 | verify-regio-apis SQL injection |
| WP-06 | sendEmail refactor |
| WP-08 | renderDownloadPage HTML |
| WP-09 | fileDownload verify FIXED |
| DUP-03 | useFilterPlans shared |
| STEP-01…08 | MAINT/ARCH execution steps (see MAINT-ARCH-PLAN) |

## Principles

1. **Re-export after each batch** → `python sigrid-findings/plan/generate-plan.py` + `python sigrid-findings/compare-exports-pair.py`.
2. **Do not re-edit FIXED files** unless regression (sendEmail, renderDownloadPage, xlsx).
3. **No file moves for score**.
4. **Do not invent lower RAW counts** until export-8 measures them.

## What’s next (post-E7)

```
1. Deploy / export-8 → regenerate plan + compare-exports-pair.py
2. Confirm WP-07 + XSS + DUP-02/08 drops (or file Sigrid remarks)
3. Remaining HIGH units (maint-arch-MASTER-action-items.csv)
4. DUP tails still open: DUP-01, DUP-07, residual DUP-04/05/06
5. DevOps DO-01 Docker USER (deferred — devops/)
```

Full HIGH list: **[Maintainability-Architecture/MAINT-ARCH-PLAN.md](./Maintainability-Architecture/MAINT-ARCH-PLAN.md)**

## Post-E7 code done (await export-8 recount)

| Item | Notes |
|------|-------|
| WP-07 redirect | `safeServerRedirect` allowlist + SPA `pendingClientPath` |
| XSS CSV remark | `escapeCsvCell` in `pointsPlansTableExport.ts` |
| DUP-02 | Shared form options/labels helpers |
| DUP-08 | ResultTab row/popup + Bottom compact list view |

E7 still shows these as open RAW until the next scan.

## Open security/reliability (2 RAW in `exported-findings-7`)

| WP | Severity | File | Issue |
|----|----------|------|-------|
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |
|  | MEDIUM | `src/helpers/tableExports/pointsPlansTableExport.ts` | User controlled data in a HTML string may result in XSS |

## Work packages (status)

| ID | Status | Phase | Name | Open sec/reliability | Open duplication |
|----|--------|-------|------|---------------------:|-----------------:|
| WP-00 | OPEN | 0 - Prep | Baseline and process | — | — |
| WP-01 | DONE | 1 - Dependencies | Backend npm dependency upgrades | — | — |
| WP-02 | DONE | 1 - Dependencies | Frontend xlsx dependency | — | — |
| WP-05 | DONE | 2 - Dev tooling | verify-regio-apis SQL injection | — | — |
| WP-06 | DONE | 3 - sendEmail cluster | sendEmail.ts single refactor | — | — |
| WP-07 | OPEN | 3 - Auth/HTML | Keycloak callback open redirect + CSV escape | 1 | — |
| WP-08 | DONE | 3 - Auth/HTML | renderDownloadPage HTML template | — | — |
| WP-09 | DONE | 3 - Auth/HTML | fileDownload.ts verify FIXED | — | — |
| DUP-01 | OPEN | 4 - Duplication | Flight plan Buttons pattern | — | 162 |
| DUP-02 | PARTIAL | 4 - Duplication | Flight plan FormElements | — | 7 |
| DUP-03 | DONE | 4 - Duplication | useFilterPlans duplicate | — | — |
| DUP-04 | PARTIAL | 4 - Duplication | PointsBuffer internal dup | — | 1 |
| DUP-05 | PARTIAL | 4 - Duplication | PeriodFilter components | — | 1 |
| DUP-06 | PARTIAL | 4 - Duplication | Dashboard user forms | — | 2 |
| DUP-07 | PARTIAL | 4 - Duplication | Zustand plan state | — | 5 |
| DUP-08 | PARTIAL | 4 - Duplication | PointsList variants | — | 13 |

## Duplication clusters (open RAW per cluster — E7 counts)

| ID | Open RAW | Notes |
|----|----------:|-------|
| DUP-01 | 162 | Shared 9-10 line button blocks across Voorbereiding wizard steps (OPEN) |
| DUP-02 | 7 | FormElements / FormInputs / Step1 — shared FlightPlanStandardFields +  (PARTIAL) |
| DUP-03 | 0 | src/hooks/filters/useFilterPlans.ts + Nabewerking copy (86% dup) (DONE) |
| DUP-04 | 1 | PointsBuffer.tsx internal duplication (shared extract partial) (PARTIAL) |
| DUP-05 | 1 | periodFilterState + zustand slices (shared extract partial) (PARTIAL) |
| DUP-06 | 2 | PasswordConfirmFields / AllUsersTable / role types (shared extract par (PARTIAL) |
| DUP-07 | 5 | Finished/reuse/view/duplicate plan state → planWizardCore still open (PARTIAL) |
| DUP-08 | 13 | ResultTab row/popup + useBottomCompactListView (code done; await expor (PARTIAL) |

## Suggested next work

1. **Export-8** — measure security + DUP-02/08 code already landed
2. **HIGH units** — `maint-arch-MASTER-action-items.csv`
3. **DUP-01 / DUP-07** — remaining duplication tails

## Files

| File | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open security/reliability actions only |
| `plan-01-security-reliability-mapping.csv` | Open (RAW) sec/reliability only |
| `plan-03-duplication-mapping.csv` | All duplication findings |
| `plan-04-false-positives-remarks.csv` | Remark text for WP-07 |
| [`Maintainability-Architecture/`](./Maintainability-Architecture/) | MAINT + ARCH work packages (1078 RAW) |
