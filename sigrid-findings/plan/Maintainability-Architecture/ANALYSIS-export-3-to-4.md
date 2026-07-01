# Why export 3 → 4 showed no Maintainability/Architecture movement

**Dashboard delta (3 → 4):** Security **3.8 → 4.3** ✅ · Reliability 5.5 · OSS 4.7 · **Maintainability 2.9 → 2.9** · **Architecture 2.2 → 2.2**

Run `python sigrid-findings/compare-3-vs-4.py` to reproduce these numbers.

## Raw finding counts (RAW only)

| Category | E3 | E4 | Δ |
|----------|---:|---:|---:|
| Unit size | 560 | 569 | **+9** |
| Unit complexity | 236 | 241 | **+5** |
| Unit interfacing | 124 | 134 | **+10** |
| Module coupling | 24 | 24 | 0 |
| Component independence | 114 | 114 | 0 |
| Component entanglement | 9 | 9 | 0 |
| **Maint + Arch total** | **1067** | **1091** | **+24** |
| Security | 4 | 3 | −1 |

Maintainability findings **went up**, not down. Architecture was untouched.

## Root causes

### 1. Extract-to-helper created *new* findings
Splitting a God-function into many small helpers means **each helper is now its own measured unit**. The new backend helper files added findings:

| New file | New RAW findings |
|----------|-----------------:|
| `createFinishedPlanDb.ts` | **+12** |
| `buildMeResponse.ts` | +6 |
| `importPointRowNormalization.ts` | +6 |
| `createPointFromImportDb.ts` | +4 |
| `arcgisTokenConfig.ts` | +3 |

The original `createFinishedPlan` was **2 findings** (size + complexity on one function). After the split, `createFinishedPlanDb.ts` had **12**, because the new helpers:
- took **3–4 parameters** → each is a *Unit interfacing* finding (Sigrid flags **≥3 params**), and
- kept long `?? null` / `||` / `?.` chains → each `??`/`||`/`?.` adds to **McCabe**, so helpers stayed over the complexity threshold (`to01` was complexity **14**, `resolveArcgisTokenConfig` **21**).

### 2. The `queries/` folder reorg was a *file move*, not a fix
Sigrid keys findings by file path. Moving `formatPlanGeometries.ts` → `geometries/formatPlanGeometries.ts` shows up as **8 "fixed" + 8 "new"** = net zero, and resets issue age. 59 of the 59 "fixed" were relocations, not real reductions.

### 3. Scale: a handful of files cannot move a system-wide star
Maintainability is an aggregate over **~1,090 units**. Refactoring ~5 files — even perfectly — is below the resolution of a 0.1-star change. To move 2.9 → 3.x you must clear findings in the **hundreds**, by pattern, across many files.

### 4. Architecture is a different metric
Architecture = module coupling + component independence + entanglement (import-graph shape). Unit-level refactors don't touch it, and **adding helper modules can slightly worsen fan-in**. It needs its own tactics (see `STRATEGY.md`).

## Corrective action already taken (this change)
The five regression helpers were rewritten the Sigrid-correct way (context objects → ≤2 params; Set/table lookups → low McCabe). Expected effect next export: `createFinishedPlanDb` and friends drop most of their findings instead of adding them.

See **`STRATEGY.md`** for the pattern-based plan to actually move both stars.
