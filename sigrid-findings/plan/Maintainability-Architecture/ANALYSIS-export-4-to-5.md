# Export 4 → 5: findings dropped, stars did not

**Dashboard delta:** Maintainability **2.9 → 2.9** · Architecture **2.2 → 2.2** · Security 4.3 · Reliability 5.5 · OSS 4.7

Run `python sigrid-findings/compare-4-vs-5.py` to reproduce.

## RAW finding counts

| Category | E4 | E5 | Δ |
|----------|---:|---:|---:|
| Unit interfacing | 134 | 100 | **−34** |
| Unit complexity | 241 | 240 | −1 |
| Unit size | 569 | 571 | +2 |
| Module coupling | 24 | 24 | 0 |
| Component independence | 114 | 114 | 0 |
| Component entanglement | 9 | 9 | 0 |
| Duplication | 209 | 214 | +5 |
| **Maint + Arch total** | **1091** | **1058** | **−33** |
| All categories | 1303 | 1275 | **−28** |

## What worked

**A1 interfacing sweep (backend)** — net **−34 interfacing** findings:

| Target | Interfacing E4 → E5 |
|--------|---------------------|
| `routeResponses` | 3 → 0 |
| `createFinishedPlanDb` | 4 → 0 |
| `regioFilter` | 3 → 0 |
| `runReturningUpdate` | 2 → 0 |
| `keycloakAdminClient` | 2 → 0 |
| `fetchConstLookup`, `fetchFlightPlanList`, etc. | cleared |

Object-param / class-field pattern is validated. Continue in **STEP-01 Part B** (99 interfacing, merged with DUP-01 for ≥100 per step).

## Why stars did not move

1. **Volume** — −33 of ~1,091 (~3%) is below Sigrid star resolution; **~300–500** clears likely needed for 2.9 → 3.x.
2. **Architecture flat** — coupling / independence / entanglement unchanged; unit edits do not move Architecture.
3. **Helper folder reorg** — file moves cleared old paths and added new ones (size +2, complexity churn); **no score benefit**.
4. **Duplication +5** — offsets part of the maint gain in the aggregate picture.

## Plan change (export 5)

Replace 20–30 finding PRs with **execution steps of ≥100 findings** each — see `MAINT-ARCH-PLAN.md` STEP-01…08 and `maint-arch-EXECUTION-STEPS.csv`.

## Corrective actions going forward

- **No file moves** for Sigrid score.
- **One step ≥100 findings** → deploy → re-export → compare before next step.
- **STEP-01** DUP-01 + interfacing sweep (265) for the largest first measurable drop.
