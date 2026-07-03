# Maintainability & Architecture

**1078 RAW** · **8 execution steps** (STEPS 01–08 complete) — see **`maint-arch-EXECUTION-STEPS.csv`**

## Read these first
1. **[ANALYSIS-export-6-to-7.md](./ANALYSIS-export-6-to-7.md)** — E6→E7: Maint **3.1 → 3.2**, Arch **+0.1**, HIGH −6, dup −18
2. **[ANALYSIS-export-5-to-6.md](./ANALYSIS-export-5-to-6.md)** — E5→E6: star **2.9 → 3.1**, HIGH −49
3. **[STRATEGY.md](./STRATEGY.md)** — Sigrid thresholds + pattern sweeps
4. **[ANALYSIS-export-4-to-5.md](./ANALYSIS-export-4-to-5.md)** — E4→E5 baseline

## Work breakdown
5. **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)** — **STEP-01…08** (all complete; use for scope reference)
6. **`maint-arch-EXECUTION-STEPS.csv`** — step scope and open RAW counts
7. **`maint-arch-MASTER-action-items.csv`** — HIGH severity units for next phase
8. **`maint-arch-01-findings-mapping.csv`** — full finding → work package map

> `ANALYSIS-*.md` and `STRATEGY.md` are hand-maintained. CSVs and `MAINT-ARCH-PLAN.md` are regenerated.

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
