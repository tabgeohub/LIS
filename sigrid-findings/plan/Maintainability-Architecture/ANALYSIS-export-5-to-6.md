# Export 5 → 6: star moved, RAW count did not

**Dashboard delta:** Maintainability **2.9 → 3.1** (+0.2) · Architecture **2.2 → 2.19** (−0.03) · Security 4.3 · Reliability 5.5 · OSS 4.7

Run `python sigrid-findings/compare-5-vs-6.py` to reproduce.

## RAW finding counts

| Category | E5 | E6 | Δ |
|----------|---:|---:|---:|
| Unit size | 571 | 622 | **+51** |
| Unit complexity | 240 | 243 | +3 |
| Unit interfacing | 100 | 92 | **−8** |
| Module coupling | 24 | 25 | +1 |
| Component independence | 114 | 95 | **−19** |
| Component entanglement | 9 | 9 | 0 |
| Duplication | 214 | 209 | **−5** |
| **Maint + Arch total (CSV)** | **1058** | **1086** | **+28** |
| Maint + Arch (plan-mapped) | 1052 | 1081 | +29 |
| All categories | 1275 | 1298 | **+23** |

## Unique findings (file + unit + description)

| | Count |
|--|------:|
| Cleared (in E5, gone in E6) | **269** |
| New (in E6, not in E5) | **295** |
| Unchanged overlap | 835 |

Net unique: **−26** — close to the +23 RAW delta.

## Severity shift (why the star moved)

| Severity (maint+arch) | E5 | E6 | Δ |
|-----------------------|---:|---:|---:|
| **HIGH** | 128 | **79** | **−49** |
| MEDIUM | 327 | 331 | +4 |
| LOW | 603 | 676 | +73 |

Sigrid stars weight **volume × severity**, not raw count alone. Clearing **49 HIGH** findings (wizard buttons, SelectFromSource, backend routes, api-hooks factory, Nabewerking/Timeslider, map hooks) moved Maintainability **2.9 → 3.1** even though extractions added smaller LOW/MEDIUM findings on helper files.

## What worked (STEPS 01–06 in code)

| Area | Evidence |
|------|----------|
| **A1 interfacing** | Unit interfacing **100 → 92** (−8) |
| **ARCH-03 api-hooks** | Component independence **114 → 95** (−19) |
| **A2 complexity** | SelectFromSource McCabe 54→20; EditPointCoordinates 46→34; map hooks split |
| **DUP extract** | Duplication **214 → 209** (−5) |
| **HIGH clearance** | **128 → 79** HIGH maint+arch (−49) |

## Extraction trade-off (watch this)

Splitting large units into helpers **cleared 269 findings** but **introduced 295 new ones**:

- Unit size **+51** — new helper files flagged as separate units
- Unit complexity **+3** — residual on extracted hooks
- Net maint+arch RAW **+28**

**Rule going forward:** extract only when the parent unit is HIGH McCabe/LOC and helpers stay ≤15 LOC / McCabe ≤5. Do not split for readability alone.

## Plan change (export 6)

- **STEPS 01–06:** implemented and deployed — star gain confirmed.
- **STEP-07 next:** Tools, Bottom lists, misc Common UI (`MAINT-08a/b/f`).
- Step RAW scopes recalibrated to **export 6** — see `MAINT-ARCH-PLAN.md` and `maint-arch-EXECUTION-STEPS.csv`.
- Re-export compare script: `compare-5-vs-6.py` (was `compare-4-vs-5.py`).

## Corrective actions going forward

- **Target remaining HIGH units first** — 79 HIGH left in maint+arch.
- **Avoid unnecessary file splits** — prefer lookup tables / early returns inside the same file when possible.
- **One step ≥100 findings cleared (net unique)** → deploy → re-export → compare before next step.
- Architecture star may need **component independence** sweeps (STEP-04 helped; more in STEP-07/08).
