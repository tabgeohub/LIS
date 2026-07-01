# Maintainability & Architecture

**1085 RAW** findings split into **MAINT-01…08** (refactor) and **ARCH-01…04** (structure).

## Read these first
1. **[ANALYSIS-export-3-to-4.md](./ANALYSIS-export-3-to-4.md)** — why export 3→4 showed no movement (and how to avoid repeating it)
2. **[STRATEGY.md](./STRATEGY.md)** — Sigrid thresholds + pattern-based plan to actually move both stars

## Work breakdown
3. **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)** — order, package table, MAINT-08 sub-slices
4. **`maint-arch-MASTER-action-items.csv`** — HIGH severity shortlist for sprints
5. **`maint-arch-01-findings-mapping.csv`** — full finding → work package map

> Note: `ANALYSIS-*.md` and `STRATEGY.md` are hand-maintained; the generator does not overwrite them.
> `MAINT-ARCH-PLAN.md`, `README.md`, and the CSVs are regenerated.

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
