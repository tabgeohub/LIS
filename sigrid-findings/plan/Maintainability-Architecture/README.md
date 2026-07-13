# Maintainability & Architecture

**1078 RAW** · STEPS 01–08 **complete** — next: HIGH units + DUP tails

## Read these first
1. **[STRATEGY.md](./STRATEGY.md)** — Sigrid thresholds + pattern sweeps
2. **[ANALYSIS-export-6-to-7.md](./ANALYSIS-export-6-to-7.md)** — last measured delta (E6→E7)
3. **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)** — progress + HIGH list + historical step scopes

## Work breakdown
4. **`maint-arch-MASTER-action-items.csv`** — HIGH severity units for next phase
5. **`maint-arch-EXECUTION-STEPS.csv`** — historical STEP-01…08 scopes
6. **`maint-arch-01-findings-mapping.csv`** — full finding → work package map

> `ANALYSIS-export-6-to-7.md` and `STRATEGY.md` are hand-maintained. CSVs and `MAINT-ARCH-PLAN.md` are regenerated.

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
