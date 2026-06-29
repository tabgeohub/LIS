# Sigrid Remediation Plan — Code only

Application code, dependencies, and maintainability. **DevOps findings (K8s, Docker, nginx) are in [`devops/`](./devops/).**

## Principles

1. **One work package = one PR** (unless explicitly noted).
2. **Fix dependencies before code that uses them** (e.g. nodemailer before sendEmail refactor).
3. **Do not split sendEmail** into separate security + refactor PRs — same file, one pass.
4. **Verify FIXED items** before re-editing (fileDownload, axios, jspdf).
5. **Re-export Sigrid CSVs** after each phase and run `generate-plan.py`.

## Finding counts (code scope)

| Area | Count | Open (RAW) |
|------|------:|-----------:|
| Security + Reliability (code) | 48 | 18 |
| Security + Reliability FIXED | 30 | — |
| Maintainability (code) | 1064 | all RAW |
| Duplication findings | 221 | all RAW |

> DevOps: 37 security/reliability findings (2 RAW) — see `devops/DEVOPS-PLAN.md`

## Phase order

```
Phase 0: Prep (WP-00)
    ↓
Phase 1: Dependencies (WP-01, WP-02) — parallel OK
    ↓
Phase 2: Dev scripts (WP-05)
    ↓
Phase 3: sendEmail (WP-06) → WP-08; WP-07 parallel; WP-09 verify only
    ↓
Phase 4: Duplication (DUP-01 … DUP-08) — one PR each
    ↓
Phase 5: Deferred maintainability (WP-10, WP-11, WP-12)
```

## Work packages

| ID | Phase | Name | Depends on | Open findings cleared |
|----|-------|------|------------|----------------------|
| WP-00 | 0 - Prep | Baseline and process | — | — |
| WP-01 | 1 - Dependencies | Backend npm dependency upgrades | WP-00 | 5 |
| WP-02 | 1 - Dependencies | Frontend xlsx dependency | WP-00 | 1 |
| WP-05 | 2 - Dev tooling | verify-regio-apis SQL injection | WP-00 | 2 |
| WP-06 | 3 - sendEmail cluster | sendEmail.ts single refactor | WP-01 | 7 |
| WP-07 | 3 - Auth/HTML | Keycloak callback open redirect | WP-00 | 2 |
| WP-08 | 3 - Auth/HTML | renderDownloadPage HTML template | WP-06 | 1 |
| WP-09 | 3 - Auth/HTML | fileDownload.ts verify FIXED | WP-08 | — |
| DUP-01 | 4 - Duplication | Flight plan Buttons pattern | Independent unless same file as WP-06 | — |
| DUP-02 | 4 - Duplication | Flight plan FormElements | Independent unless same file as WP-06 | — |
| DUP-03 | 4 - Duplication | useFilterPlans duplicate | Independent unless same file as WP-06 | — |
| DUP-04 | 4 - Duplication | PointsBuffer internal dup | Independent unless same file as WP-06 | — |
| DUP-05 | 4 - Duplication | PeriodFilter components | Independent unless same file as WP-06 | — |
| DUP-06 | 4 - Duplication | Dashboard user forms | Independent unless same file as WP-06 | — |
| DUP-07 | 4 - Duplication | Zustand plan state | Independent unless same file as WP-06 | — |
| DUP-08 | 4 - Duplication | PointsList variants | Independent unless same file as WP-06 | — |
| WP-10 | 5 - Defer | High fan-in hooks | Duplication phase stable | — |
| WP-11 | 5 - Defer | Large map/ArcGIS units | Duplication phase stable | — |
| WP-12 | 5 - Defer | Architecture coupling | WP-10 | — |

## Open security/reliability items (18 RAW)

| WP | Severity | File | Issue |
|----|----------|------|-------|
| WP-05 | CRITICAL | `backend/scripts/verify-regio-apis.js` | Untrusted input concatinated with raw SQL query can result in SQL Injection |
| WP-05 | CRITICAL | `backend/scripts/verify-regio-apis.js` | Untrusted input concatinated with raw SQL query can result in SQL Injection |
| WP-01 | HIGH | `backend/package-lock.json` | NPM dependency multer contains 2 vulnerabilities |
| WP-01 | HIGH | `backend/package-lock.json` | NPM dependency nodemailer contains 1 vulnerability |
| WP-01 | HIGH | `backend/package-lock.json` | NPM dependency undici contains 7 vulnerabilities |
| WP-01 | HIGH | `backend/package-lock.json` | NPM dependency multer contains 2 vulnerabilities |
| WP-01 | HIGH | `backend/package-lock.json` | NPM dependency undici contains 7 vulnerabilities |
| WP-06 | HIGH | `backend/src/routes/emails/sendEmail.ts` | If unverified user data can reach the `puppeteer` methods it can result in Serve |
| WP-02 | HIGH | `package-lock.json` | NPM dependency xlsx contains 2 vulnerabilities |
| WP-08 | MEDIUM | `backend/src/helpers/renderDownloadPage.ts` | This template literal looks like HTML and has interpolated variables |
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |
| WP-07 | MEDIUM | `backend/src/routes/auth/authKeycloak/callbackHandler.ts` | Untrusted user input in redirect() can result in Open Redirect vulnerability |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | User data flows into the host portion of this manually-constructed HTML |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | This template literal looks like HTML and has interpolated variables |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | User data flows into the host portion of this manually-constructed HTML |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | User data flows into the host portion of this manually-constructed HTML |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | User data flows into the host portion of this manually-constructed HTML |
| WP-06 | MEDIUM | `backend/src/routes/emails/sendEmail.ts` | User data flows into the host portion of this manually-constructed HTML |

## File collision map

| File | Work packages | Risk |
|------|---------------|------|
| `backend/package-lock.json` | WP-01 only | Lockfile conflicts |
| `backend/src/routes/emails/sendEmail.ts` | WP-06 only | Security + size + complexity |
| `backend/src/helpers/renderDownloadPage.ts` | WP-08 (after WP-06) | Shared HTML utils |
| `backend/scripts/verify-regio-apis.*` | WP-05 only | Delete .js after .ts fix |
| Voorbereiding wizard folders | DUP-01, DUP-02 sequential | UI merge conflicts |

## Suggested first sprint (code only)

1. **WP-01** — backend deps (multer, undici, nodemailer)
2. **WP-02** — xlsx lockfile verify
3. **WP-05** — verify-regio-apis dev script
4. **WP-07** — callback tests + remark
5. **WP-06** — sendEmail single refactor

Defer duplication (Phase 4) until code security/reliability RAW = 0.
