# Unit size remediation — export `20260718(1)` (746 findings)

**Source:** [`unit-size-findings-rijkswaterstaat-otg-lis-20260718(1).csv`](./unit-size-findings-rijkswaterstaat-otg-lis-20260718(1).csv)  
**Scope:** Unit size only  
**Hard rule:** leave MEDIUM only by ending at **≤30 LOC** (MEDIUM floor = 31). No Docker / Nginx / schema / HTTP contract edits.

## Scoreboard (pre-fix baseline)

| Band | Prior Jul 18 | This export `(1)` | Delta |
| --- | ---: | ---: | ---: |
| HIGH | 5 | **0** | −5 |
| MEDIUM | 162 | **75** (74 TS + 1 Docker) | −87 |
| LOW | 529 | **671** | +142 |
| **Total** | 696 | **746** | +50 |

## Waves — status

### Wave 0 — Rebaseline — Done

This document; `(1)` CSV is source of truth.

### Wave A — MEDIUM McCabe ≥ 3 → ≤30 — Applied

All executable MEDIUM McCabe ≥ 3 thinned to ≤30 façades (FE + BE).  
**Accepted (skipped):** `verify-regio-apis.ts.testResolveRegioFilter`.

### Wave B — McCabe ≤ 2, LOC ≥ 40 → ≤30 — Applied

Split catalogues / composition: `queryKeys`, timeslider page/range hooks, Forms, Overig layer specs, swagger, ArcGIS token field specs, Zustand/mapView, symbols, regions, AddPointStep, etc.

### Wave C — MEDIUM 31–39, McCabe ≤ 2 — Applied

Batched remaining ~35 units (FE + BE finished-plan queries, spoed PDF, middleware, lists, stores, CreateReport pipeline, etc.) to ≤30 LOC.

## Still out of scope

- `backend/dockerfile` (deployment)

## Verification

1. `npm run check:architecture` — passed (this wave)
2. `npm run test:architecture-helpers` — passed
3. Next Sigrid export: expect MEDIUM TS near zero (except Accepted script + Docker); HIGH stays 0; raw total may rise from new LOWs — judge by MEDIUM count / Unit size stars

## Success metrics (next export)

- MEDIUM TypeScript McCabe ≥ 3 → **0** (except Accepted `verify-regio-apis`)
- MEDIUM TypeScript LOC ≥ 40 → **0** (Docker excluded)
- HIGH stays **0**
