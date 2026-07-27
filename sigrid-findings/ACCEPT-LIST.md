# Sigrid Accept list — export `20260727` (full pack)

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.
**No Dockerfile or Nginx edits.**

Source: [`all-findings-rijkswaterstaat-otg-lis-20260727`](./all-findings-rijkswaterstaat-otg-lis-20260727/)  
Checklist: [`SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md)

## Architecture — Component independence HIGH (Accept — intentional façades)

| Module | Why |
| --- | --- |
| `src/api-hooks/templateFlights/useTemplateFlights.ts` | Domain React Query façade |
| `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | Domain React Query façade |
| `src/api-hooks/points/usePointLookupQueries.ts` | Domain React Query façade |
| `src/hooks/useLogAction.ts` | App-wide logging façade |
| `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` | Domain React Query façade |
| `src/hooks/consts/useConstSelectOptions.ts` | Const lookup façade |
| `src/hooks/useGetFlightTimesDistance.ts` | Thin query wrapper |
| `src/api-hooks/consts/useLookupQuery.ts` | Shared lookup façade |
| `src/helpers/refreshToken.ts` | Auth helper entry |
| `src/api-hooks/emails/useEmailsList.ts` | Domain React Query façade |

## Architecture — Independence MEDIUM (Accept — 133 items)

Accept all MEDIUM independence rows. **Do not re-split `*Core` for score.**

## Architecture — Module coupling (Accept — 24 items)

| Module | Why |
| --- | --- |
| `useLogAction` / `useContent` | HIGH fan-in by design |
| `nnederlandLayerBuilders` / icon primitives | Layer catalogue hubs |
| `useUpdateDataCore`, `routeResponses` | Shared HTTP helpers |
| `useWizardButtons`, `useConstSelectOptions`, `useResetFeatures` | Cohesive hooks |
| EditGeometry `coords.ts`, `validateMapView` | Tiny shared utilities |
| Remaining LOW coupling | Shared infrastructure |

## Architecture — Component entanglement (Accept — 5)

High/moderate communication density on `api-hooks`, `helpers`, `hooks`, `HomePage`, `TimesliderItemDetailPage` — intentional layers.

## Maintainability — Unit size (Accept)

| Module | Why |
| --- | --- |
| `backend/dockerfile` | Deployment artifact — no Dockerfile edits |
| `backend/scripts/verify-regio-apis.ts` | Verification script |

## Maintainability — Duplication (code-fixed this wave)

| Clone | Status |
| --- | --- |
| FlightPlan ↔ TemplateFlight Step2 | **Code-fixed** — `useWizardFilterStep2Buttons` takes `store` + `mapView` |
| FE↔BE devices re-export twin | **Code-fixed** — BE `types.ts` no longer re-exports shared types |

Expect Dup HIGH → **0** on rescan.

## Security

| Finding | Action |
| --- | --- |
| Docker CWE-266 / CWE-250 (root USER) | **Accept** — no Dockerfile edits |
| `react-router-dom` CWE-601 | **Code-fixed** — dependency bump |

## Expected post-Accept

Architecture actionable independence/coupling/entanglement cleared in UI; Maintainability Dup cleared by code; Security Docker accepted, OSH react-router cleared by bump.
