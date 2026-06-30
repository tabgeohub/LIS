# Sigrid Remediation Plan — Code only

**Source:** `exported-findings-3` · **Generated:** 2026-06-30

Application code, dependencies, and maintainability. **DevOps (Docker) is in [`devops/`](./devops/) — out of scope for code sprints.**

## Current state (export 3)

| Metric | Value |
|--------|------:|
| Security + Reliability (code) RAW | **2** |
| Security + Reliability FIXED (code) | 47 |
| Maintainability RAW | 1066 |
| Duplication RAW | 206 |

**Dashboard (export 3):** Security 3.8 · Reliability 5.5 · OSS Health 4.7 · Maintainability 2.9

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

1. **One work package = one PR** (unless explicitly noted).
2. **Re-export Sigrid CSVs** after each phase → `python sigrid-findings/plan/generate-plan.py`
3. **Do not re-edit FIXED files** unless regression (sendEmail, renderDownloadPage, xlsx).
4. **WP-07** — code fix deployed; remaining step is **Sigrid remark** (scanner false positive).

## What’s next (recommended order)

```
1. WP-07  → Sigrid remark on callbackHandler (2 MEDIUM RAW → 0)
2. DUP-01 → Wizard button clusters (largest open duplication)
3. DUP-02 → Flight plan form fields (partial — continue shared components)
4. DUP-07 → Zustand plan state (partial — view/duplicate stores done)
5. DUP-08 → PointsList variants (partial — Voorbereiding lists done)
6. **[Maintainability-Architecture/](./Maintainability-Architecture/)** — MAINT-01…08 + ARCH-01…04 (after duplication)
```

## Open security/reliability (2 RAW)

| WP | Severity | File | Issue |
|----|----------|------|-------|
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |

## Work packages (status)

| ID | Status | Phase | Name | Open sec/reliability | Open duplication |
|----|--------|-------|------|---------------------:|-----------------:|
| WP-00 | OPEN | 0 - Prep | Baseline and process | — | — |
| WP-01 | DONE | 1 - Dependencies | Backend npm dependency upgrades | — | — |
| WP-02 | DONE | 1 - Dependencies | Frontend xlsx dependency | — | — |
| WP-05 | DONE | 2 - Dev tooling | verify-regio-apis SQL injection | — | — |
| WP-06 | DONE | 3 - sendEmail cluster | sendEmail.ts single refactor | — | — |
| WP-07 | OPEN | 3 - Auth/HTML | Keycloak callback open redirect | 2 | — |
| WP-08 | DONE | 3 - Auth/HTML | renderDownloadPage HTML template | — | — |
| WP-09 | DONE | 3 - Auth/HTML | fileDownload.ts verify FIXED | — | — |
| DUP-01 | OPEN | 4 - Duplication | Flight plan Buttons pattern | — | 159 |
| DUP-02 | PARTIAL | 4 - Duplication | Flight plan FormElements | — | 6 |
| DUP-03 | DONE | 4 - Duplication | useFilterPlans duplicate | — | — |
| DUP-04 | PARTIAL | 4 - Duplication | PointsBuffer internal dup | — | 1 |
| DUP-05 | PARTIAL | 4 - Duplication | PeriodFilter components | — | 1 |
| DUP-06 | PARTIAL | 4 - Duplication | Dashboard user forms | — | 3 |
| DUP-07 | PARTIAL | 4 - Duplication | Zustand plan state | — | 5 |
| DUP-08 | PARTIAL | 4 - Duplication | PointsList variants | — | 31 |

## Duplication clusters (open RAW per cluster)

| ID | Open RAW | Notes |
|----|----------:|-------|
| DUP-01 | 159 | Shared 9-10 line button blocks across Voorbereiding wiz (OPEN) |
| DUP-02 | 6 | FormElements / FormInputs / Step1 shared form blocks (PARTIAL) |
| DUP-03 | 0 | src/hooks/filters/useFilterPlans.ts + Nabewerking copy  (DONE) |
| DUP-04 | 1 | PointsBuffer.tsx internal duplication (PARTIAL) |
| DUP-05 | 1 | Three PeriodFilter copies (PARTIAL) |
| DUP-06 | 3 | AllRoles / AddUser / EditUser (PARTIAL) |
| DUP-07 | 5 | Finished/reuse/view/duplicate plan state hooks (PARTIAL) |
| DUP-08 | 31 | PointsList.tsx / PointsListEdit.tsx (PARTIAL) |

## Suggested next sprint (code only)

1. **WP-07** — Add Sigrid remark (fixed redirect + `pendingClientPath` via `/auth/me`)
2. **DUP-01** — One wizard button sub-cluster per PR
3. **DUP-02** — Extend `usePopulateFlightPlanFormEffect` to remaining Step1/Form views

## Files

| File | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open security/reliability actions only |
| `plan-01-security-reliability-mapping.csv` | Open (RAW) sec/reliability only |
| `plan-01-cleared-security-reliability.csv` | FIXED sec/reliability (archive) |
| `plan-03-duplication-mapping.csv` | All duplication findings |
| `plan-04-false-positives-remarks.csv` | Remark text for WP-07 |
| [`Maintainability-Architecture/`](./Maintainability-Architecture/) | MAINT + ARCH work packages ({maint_arch_raw} RAW) |
