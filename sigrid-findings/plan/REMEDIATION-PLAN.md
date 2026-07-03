# Sigrid Remediation Plan — Code only

**Source:** `exported-findings-5` · **Generated:** 2026-07-01

Application code, dependencies, and maintainability. **DevOps (Docker) is in [`devops/`](./devops/) — out of scope for code sprints.**

## Current state (`exported-findings-5`)

| Metric | Value |
|--------|------:|
| Security + Reliability (code) RAW | **1** |
| Security + Reliability FIXED (code) | 48 |
| Maintainability RAW | 1057 |
| Duplication RAW | 214 |

**Dashboard (export 5):** Security 4.3 · Reliability 5.5 · OSS Health 4.7 · Maintainability **2.9** · Architecture **2.2**
_(export 4 → 5: maint+arch RAW **1091 → 1052** (−33); stars unchanged — need **≥100 findings per step** and ~300+ total to move a star. See [ANALYSIS-export-4-to-5.md](./Maintainability-Architecture/ANALYSIS-export-4-to-5.md).)_

## Completed (no open code security/reliability RAW)

| ID | Name |
|----|------|
| WP-01 | Backend deps (multer, undici, nodemailer) |
| WP-02 | Frontend xlsx → `@e965/xlsx` (FIXED in Sigrid) |
| WP-05 | verify-regio-apis SQL injection |
| WP-06 | sendEmail refactor |
| WP-08 | renderDownloadPage HTML |
| WP-09 | fileDownload verify FIXED |
| DUP-03 | useFilterPlans shared |
| DUP-04 | PointsBuffer (partial — 1 dup finding left) |
| DUP-05 | PeriodFilter panel (partial) |
| DUP-06 | Dashboard user forms (partial) |

## Principles

1. **Each execution step clears ≥100 findings** — see [MAINT-ARCH-PLAN.md](./Maintainability-Architecture/MAINT-ARCH-PLAN.md) STEP-01…08.
2. **Re-export Sigrid after each step** → `python sigrid-findings/plan/generate-plan.py` + `python sigrid-findings/compare-4-vs-5.py` (update export folder names).
3. **Do not re-edit FIXED files** unless regression (sendEmail, renderDownloadPage, xlsx).
4. **No file moves for score** — folder reorg caused churn in E4→E5 without star movement.

## What’s next (recommended order)

```
Prep  → WP-07 Sigrid remark on callbackHandler (1 code RAW; not a full step)
STEP-01 → DUP-01 wizard buttons + A1 interfacing sweep (265 RAW)
STEP-02 → Voorbereiding complexity (MAINT-03) (175 RAW)
STEP-03 → Backend complexity + size (MAINT-01) (236 RAW)
STEP-04 → Architecture — api-hooks factory (ARCH-03) (113 RAW)
STEP-05 → Nabewerking + Timeslider (MAINT-02 + MAINT-07) (136 RAW)
STEP-06 → Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) (144 RAW)
STEP-07 → Frontend catch-all remainder (MAINT-08a/b/f) (145 RAW)
STEP-08 → ArcGIS + remaining duplication + admin + arch tail (151 RAW)
```

Full step table: **[Maintainability-Architecture/MAINT-ARCH-PLAN.md](./Maintainability-Architecture/MAINT-ARCH-PLAN.md)**

## Open security/reliability (1 RAW)

| WP | Severity | File | Issue |
|----|----------|------|-------|
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |

## Work packages (status)

| ID | Status | Phase | Name | Open sec/reliability | Open duplication |
|----|--------|-------|------|---------------------:|-----------------:|
| WP-00 | OPEN | 0 - Prep | Baseline and process | — | — |
| WP-01 | DONE | 1 - Dependencies | Backend npm dependency upgrades | — | — |
| WP-02 | DONE | 1 - Dependencies | Frontend xlsx dependency | — | — |
| WP-05 | DONE | 2 - Dev tooling | verify-regio-apis SQL injection | — | — |
| WP-06 | DONE | 3 - sendEmail cluster | sendEmail.ts single refactor | — | — |
| WP-07 | OPEN | 3 - Auth/HTML | Keycloak callback open redirect | 1 | — |
| WP-08 | DONE | 3 - Auth/HTML | renderDownloadPage HTML template | — | — |
| WP-09 | DONE | 3 - Auth/HTML | fileDownload.ts verify FIXED | — | — |
| DUP-01 | OPEN | 4 - Duplication | Flight plan Buttons pattern | — | 166 |
| DUP-02 | PARTIAL | 4 - Duplication | Flight plan FormElements | — | 7 |
| DUP-03 | DONE | 4 - Duplication | useFilterPlans duplicate | — | — |
| DUP-04 | PARTIAL | 4 - Duplication | PointsBuffer internal dup | — | 1 |
| DUP-05 | PARTIAL | 4 - Duplication | PeriodFilter components | — | 1 |
| DUP-06 | PARTIAL | 4 - Duplication | Dashboard user forms | — | 3 |
| DUP-07 | PARTIAL | 4 - Duplication | Zustand plan state | — | 5 |
| DUP-08 | PARTIAL | 4 - Duplication | PointsList variants | — | 31 |

## Duplication clusters (open RAW per cluster)

| ID | Open RAW | Notes |
|----|----------:|-------|
| DUP-01 | 166 | Shared 9-10 line button blocks across Voorbereiding wiz (OPEN) |
| DUP-02 | 7 | FormElements / FormInputs / Step1 shared form blocks (PARTIAL) |
| DUP-03 | 0 | src/hooks/filters/useFilterPlans.ts + Nabewerking copy  (DONE) |
| DUP-04 | 1 | PointsBuffer.tsx internal duplication (PARTIAL) |
| DUP-05 | 1 | Three PeriodFilter copies (PARTIAL) |
| DUP-06 | 3 | AllRoles / AddUser / EditUser (PARTIAL) |
| DUP-07 | 5 | Finished/reuse/view/duplicate plan state hooks (PARTIAL) |
| DUP-08 | 31 | PointsList.tsx / PointsListEdit.tsx (PARTIAL) |

## Suggested next work

1. **WP-07** — Sigrid remark (parallel, small)
2. **STEP-01** — DUP-01 wizard buttons + A1 interfacing sweep (265 findings)
3. **STEP-02 — Voorbereiding complexity (MAINT-03) (175 findings)** — after STEP-01 deploy + re-export

## Files

| File | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open security/reliability actions only |
| `plan-01-security-reliability-mapping.csv` | Open (RAW) sec/reliability only |
| `plan-01-cleared-security-reliability.csv` | FIXED sec/reliability (archive) |
| `plan-03-duplication-mapping.csv` | All duplication findings |
| `plan-04-false-positives-remarks.csv` | Remark text for WP-07 |
| [`Maintainability-Architecture/`](./Maintainability-Architecture/) | MAINT + ARCH work packages (1052 RAW) |
