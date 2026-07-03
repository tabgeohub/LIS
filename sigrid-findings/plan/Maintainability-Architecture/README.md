# Maintainability & Architecture

**1081 RAW** · **8 execution steps** (each ≥100 findings) — see **`maint-arch-EXECUTION-STEPS.csv`**

## Read these first
1. **[ANALYSIS-export-5-to-6.md](./ANALYSIS-export-5-to-6.md)** — E5→E6: star **2.9 → 3.1**, HIGH −49, net RAW +28
2. **[STRATEGY.md](./STRATEGY.md)** — Sigrid thresholds + ≥100 finding steps
3. **[ANALYSIS-export-4-to-5.md](./ANALYSIS-export-4-to-5.md)** — E4→E5 baseline

## Work breakdown
4. **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)** — **STEP-01…08** (primary execution order)
5. **`maint-arch-EXECUTION-STEPS.csv`** — step scope and open RAW counts
6. **`maint-arch-MASTER-action-items.csv`** — HIGH severity units inside the current step
7. **`maint-arch-01-findings-mapping.csv`** — full finding → work package map

> `ANALYSIS-*.md` and `STRATEGY.md` are hand-maintained. CSVs and `MAINT-ARCH-PLAN.md` are regenerated.

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
