# Unit size remediation — Jul 18 rebase (≤30 LOC exit)

**Source:** [`unit-size-findings-rijkswaterstaat-otg-lis-20260718.csv`](./unit-size-findings-rijkswaterstaat-otg-lis-20260718.csv)  
**Scope:** Unit size only  
**Related:** [`REMEDIATION-PLAN.md`](./REMEDIATION-PLAN.md); [`ARCHITECTURE-PHASES.md`](./ARCHITECTURE-PHASES.md)

## Scoreboard (July 18 export — pre-fix baseline)

| Severity | Count | Notes |
| --- | ---: | --- |
| HIGH | 5 | Included executable HIGH `buildTimesliderPageShell` (76 / McCabe 16) |
| MEDIUM | 162 | Floor = **31 LOC** (LOW max = 30) |
| LOW | 529 | ≤30 LOC |
| **Total** | **696** | Prior extracts created new fat helpers ≥31 LOC |

## Hard rule (score fix)

Every unit we touch that should leave MEDIUM/HIGH must end **≤30 LOC**. Prefer several ≤25 LOC pure helpers over one ~40 LOC extract.

Do **not** edit Dockerfiles / Nginx / deployment / schemas / HTTP contracts.

## Success metrics (next export after this wave)

- HIGH executable = 0
- MEDIUM TypeScript with McCabe ≥ 3 and LOC ≥ 40 → 0 (except Accepted shells)
- Net drop in HIGH+MEDIUM TypeScript (baseline was **166**)

---

## Wave 0 — Rebaseline — Done

This document; ≤30 LOC exit rule; Jul 18 CSV as source of truth.

---

## Wave 1 — Kill HIGH — Applied

| Unit | CSV LOC | McCabe | Status |
| --- | ---: | ---: | --- |
| `buildTimesliderPageShell` | 76 | 16 | Applied — header / plansOverlay / imageViewer builders + types |
| `nnederlandLayerSpecsPart{1,2,3}` | 78–83 | 1 | Applied — part*a–d chunks; Part barrels ≤10 LOC |
| `voorbereidingTabs` | 63 | 1 | Applied — part1 + part2; thin barrel |
| `backend/dockerfile` | 59 | — | Out of scope |

---

## Wave 2 — Re-split Applied helpers still ≥31 — Applied

| Unit | CSV LOC | Status |
| --- | ---: | --- |
| `generateReportZip` | 57 | Applied — assemble / write / filter helpers |
| `fetchArcgisAdminTokenOnce` | 56 | Applied — post / parse / request / expiry |
| `MapViewComp` | 54 | Applied — model / panel / view pieces |
| `fetchTimesliderPlanImages` | 50 | Applied — parse / fetch / map |
| `useEditPointCoordinateInputs` | 47 | Applied — coord state / sync effects |
| `buildAndSendSpoedReport` | 45 | Applied — mail / PDF / error helpers |
| `setupClickListener` | 44 | Applied — `handleMapClickHit` |
| `addPlanGeometryHighlights` | 41 | Applied — highlight factory |
| `applyGeometryCommentUpdate` | 40 | Applied — success / patch helpers |
| `buildPlanGeometryGraphics` | 38 | Applied — per-geometry graphic |
| `useTimesliderFlightPlans` | 33 | Applied — load / draw effects |
| Leftovers (`syncRealmRoleMappings`, `createPointFromImport`, `sessionStoreSetup`, `startPolygonDrawer`, `fetchAttachmentsForPoint`, …) | ≥31 | Applied — same ≤30 rule |

---

## Wave 3 — MEDIUM ≥40 LOC, McCabe ≥ 3 — Applied

~39 executable frontend + backend façades thinned to ≤30 LOC (sibling helpers). Skipped Accepted: `verify-regio-apis`, delete-point Step1 `Form` (McCabe 2 shell), McCabe-1 catalogues/composition.

---

## Wave 4 — MEDIUM 31–39 LOC, McCabe ≥ 3 — Applied (batched)

- McCabe ≥ 7 band: thinned (FE + BE including `server.ts` orchestration)
- McCabe 5–6 high-LOC band: 18+ units thinned; several already ≤30 from Waves 2–3 skipped
- Remaining McCabe 3–4 in 31–39: opportunistic on next touch (lower score weight)

---

## Accepted appendix (unchanged intent)

- `queryKeys`, `useTimesliderImagePageData`, `usePointsViewController` when pure composition
- Delete-point Step1 `Form` field shell
- `verify-regio-apis` backend script
- Deployment Dockerfiles (out of scope)

---

## Verification

1. `npm run check:architecture` — passed (this wave)
2. `npm run test:architecture-helpers` — passed
3. After deploy: re-export Unit size; compare to Jul 18 — expect HIGH executable gone and HIGH+MEDIUM TS volume down

## Related

- Source CSV: [`unit-size-findings-rijkswaterstaat-otg-lis-20260718.csv`](./unit-size-findings-rijkswaterstaat-otg-lis-20260718.csv)
