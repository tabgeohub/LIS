# Sigrid Accept list — export `sigrid-227`

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.
**No Dockerfile or Nginx edits.**

Source: [`sigrid-findings/sigrid-227`](./sigrid-227/)  
Checklist with CSV line refs: [`SIGRID-227-ACCEPT-CHECKLIST.md`](./SIGRID-227-ACCEPT-CHECKLIST.md)

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

## Architecture — Independence MEDIUM `*Core` bodies (Accept — 133 items)

Façade-only splits did not move Architecture stars. Accept all MEDIUM independence rows in `Component independence findings.csv` (rows 12–144). **Do not re-split for score.**

Includes shared `hooks/` / `helpers/` / `api-hooks/` Core/Internal modules (`centerAndZoomMathCore`, `csvExportCore`, `useUpdateDataCore`, hover siblings, etc.).

## Architecture — Module coupling (Accept — 24 items)

| Module | Why |
| --- | --- |
| `src/hooks/useLogAction.ts` | HIGH fan-in by design |
| `src/hooks/useContent.ts` | HIGH fan-in i18n hub |
| `nnederlandLayerBuilders.ts` | Layer catalogue builder hub |
| `useUpdateDataCore.ts` | Shared mutation helper |
| `routeResponses.ts` | Shared HTTP helpers |
| `nnederlandIconPrimitives.tsx` | Layer icon primitives hub |
| `useWizardButtons.ts` | Cohesive wizard hook |
| `useConstSelectOptions.ts` | Const lookup façade |
| `useResetFeatures.ts` | Feature reset hook |
| EditGeometry `coords.ts` | Tiny shared utility |
| `validateMapView.ts` | Tiny map guard |
| Remaining LOW coupling rows | Shared infrastructure (keycloak admin, regio filter, etc.) |

## Architecture — Component entanglement (Accept)

| Finding | Why |
| --- | --- |
| High density on `src/api-hooks` | Intentional façade layer |
| Moderate density on `src/helpers` | Shared helper layer |
| Moderate density on `src/hooks` | Shared hook layer |
| Moderate density on `src/Components/HomePage` | Main UI shell |
| Moderate density on `src/Components/TimesliderItemDetailPage` | Feature page shell |
| Cyclic `hooks` ↔ `HomePage` | **Code-fixed** — expect FIXED on rescan |

## Maintainability — Unit size (Accept)

| Module | Why |
| --- | --- |
| `backend/dockerfile` / root `dockerfile` | Deployment artifact |
| `backend/scripts/verify-regio-apis.ts` | Verification script |

## Maintainability — Duplication (Accept / out of scope)

| Clone family | Why |
| --- | --- |
| FE↔BE `keycloakUser` | Needs shared package |
| FE↔BE `devices` (2 clones) | Needs shared package |
| FE↔BE `pointCoreColumns` ↔ identity keys | Cross-layer twin |
| FE↔BE `flightPlanFieldNormalize` ↔ persistence fields | Cross-layer twin |
| FE↔BE `createGeometryInsert` ↔ drawing form fields | Cross-layer twin |
| FE↔BE `installer` | Needs shared package |
| `public/index.html` ↔ root `index.html` | CRA vs Vite entry shells |
| `PointDetailsFieldsList` 3-way column keys | Accept residual |

Same-component Dup HIGH clones (Step2 Buttons, PlanInformation, dashboard handlers, timeslider, `appendFlightPlanWhereClause`) were unified in code — expect FIXED on rescan.

## Security (Accept / out of scope)

| Finding | Why |
| --- | --- |
| Docker CWE-266 (`dockerfile`, `backend/dockerfile`) | Out of scope unless non-root containers required |

`csvExportCore` XSS — **FIXED** in prior wave.

## Expected post-Accept

Architecture actionable code drops from **172 → ~15** (mostly low fan-in coupling LOWs + `nnederlandIconPrimitives` MEDIUM if not accepted).
