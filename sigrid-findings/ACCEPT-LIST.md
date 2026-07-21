# Sigrid Accept list — export `20260721(1)`

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.
**No Dockerfile or Nginx edits.**

Source: [`all-findings-rijkswaterstaat-otg-lis-20260721(1)`](./all-findings-rijkswaterstaat-otg-lis-20260721(1)/)

## Architecture — Component independence HIGH (Accept — intentional façades)

| Module | Why |
| --- | --- |
| `src/hooks/useLogAction.ts` | App-wide logging façade |
| `src/hooks/useContent.ts` | App-wide i18n/content hub (also Coupling HIGH) |
| `src/hooks/consts/useConstSelectOptions.ts` | Const lookup façade |
| `src/hooks/useGetFlightTimesDistance.ts` | Thin query wrapper |
| `src/hooks/flightPlan/useFlightPlanStandardSelectProps.ts` | Thin select-props wrapper |
| `src/helpers/refreshToken.ts` | Auth helper entry |
| `src/api-hooks/templateFlights/useTemplateFlights.ts` | Domain React Query façade |
| `src/api-hooks/points/usePointLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | Domain React Query façade |
| `src/api-hooks/consts/useLookupQuery.ts` | Shared lookup façade |
| `src/api-hooks/emails/useEmailsList.ts` | Domain React Query façade |
| `src/hooks/hover-click-handlers/showPlanSearchListHoverCore.ts` | Private sibling of hover façade |

## Architecture — Independence MEDIUM `*Core` bodies (Accept)

Façade-only splits did not move Architecture stars. Accept remaining shared `hooks/` / `helpers/` / `api-hooks/` Core/Internal modules. **Do not re-split for score.**

## Architecture — Module coupling (Accept)

| Module | Why |
| --- | --- |
| `useLogAction` / `useContent` | HIGH fan-in by design |
| `validateMapView`, EditGeometry `coords.ts` | Tiny shared utilities |
| `useWizardButtons`, `useConstSelectOptions`, `useResetFeatures` | Cohesive hooks |
| `nnederlandLayerBuilders` / icon primitives | Layer catalogue builders |
| `useUpdateDataCore`, `routeResponses` | Shared HTTP helpers |

## Architecture — Component entanglement (Accept after Wave A)

| Finding | Why |
| --- | --- |
| High density on `src/api-hooks` / `src/hooks` | Intentional façade layers |
| Cyclic `hooks` ↔ `HomePage` | **Code-fixed** in Wave A — expect FIXED on rescan |

## Maintainability — Unit size (Accept)

| Module | Why |
| --- | --- |
| `backend/dockerfile` | Deployment artifact |
| `backend/scripts/verify-regio-apis.ts` | Verification script |

## Maintainability — Duplication (Accept / out of scope)

| Clone family | Why |
| --- | --- |
| FE↔BE `keycloakUser`, `devices`, `installer` | Needs shared package |
| FE↔BE `pointCoreColumns` ↔ FE identity keys | Cross-layer twin |
| FE↔BE flight-plan persistence field lists | Cross-layer twin |
| FE↔BE `createGeometryInsert` ↔ drawing form fields | Cross-layer twin |
| `public/index.html` ↔ root `index.html` | CRA vs Vite entry shells |

## Security (Accept / out of scope)

| Finding | Why |
| --- | --- |
| Docker CWE-266 (`dockerfile`, `backend/dockerfile`) | Out of scope unless non-root containers required |
